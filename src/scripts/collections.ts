import { tryCatch } from "@/scripts/try-catch";
import type {
	MunicipalityProperties,
	RegionProperties,
	SchoolProperties,
} from "@/scripts/types";
import { centerMedian, featureCollection, multiPoint, point } from "@turf/turf";
import Airtable from "airtable";
import type { Feature, MultiPoint, Point } from "geojson";

const SUBMISSION_IDS = "Submissions 2";
const REGION_NAME = "BEL_REGION_TEKST";
const REGION_ID = "BEL_REGION";
const MUNICIPALITY_NAME = "KOMMUNE";
const MUNICIPALITY_ID = "BEL_KOMMUNE";
const SCHOOL_NAME = "INST_NAVN";
const SCHOOL_ID = "INST_NR";
const LATITUDE = "GEO_BREDDE_GRAD";
const LONGITUDE = "GEO_LAENGDE_GRAD";
const RECORD_ID = "Record ID";
const START_YEAR = "Startyear_static";

const MIN_LAT = 54.54105080166195;
const MAX_LAT = 57.770218411476634;
const MIN_LNG = 8.052716042949726;
const MAX_LNG = 15.210410477270017;

const base = new Airtable({ apiKey: import.meta.env.AIRTABLE_API_KEY }).base(
	"appFpQHfnl4TDWh4c",
);

export const getSchools = async () => {
	// Fetch the submissions in advance
	const submissions: Record<string, number> = {};
	await tryCatch(
		new Promise<boolean>((resolve, reject) => {
			// If the request takes longer than a minute, reject the promise
			const timeout = setTimeout(() => {
				reject(new Error("Submissions timeout"));
			}, 60_000);

			// Fetch the submissions
			base("Submissions")
				.select({
					// Only fetch the record id and start year
					fields: [RECORD_ID, START_YEAR],
				})
				.eachPage(
					// This function (`page`) will get called for each page of records.
					(records, processNextPage) => {
						for (const record of records) {
							// Get the submission id and start year
							const submissionId = record.get(RECORD_ID);
							const startYear = Number(record.get(START_YEAR));

							// If the submission id is not a string or the start year is NaN, skip the record
							if (typeof submissionId !== "string" || Number.isNaN(startYear)) {
								continue;
							}

							// Add the submission id and start year to the submissions object
							submissions[submissionId] = startYear;
						}

						// To fetch the next page of records, call `processNextPage`.
						// If there are more records, this function will get called again.
						// If there are no more records, `done` will get called.
						processNextPage();
					},

					// This function is called when all pages have been fetched
					(error) => {
						if (error) {
							console.error(error);
							reject(error);
							return;
						}

						clearTimeout(timeout);
						resolve(true);
					},
				);
		}),
	);

	// Create an empty feature collection
	const schools = featureCollection<Point, SchoolProperties>([]);

	const { error } = await tryCatch(
		new Promise<boolean>((resolve, reject) => {
			// If the request takes longer than a minute, reject the promise
			const timeout = setTimeout(() => {
				reject(new Error("Schools timeout"));
			}, 60_000);

			base("Schools")
				.select({
					view: "Grid view",
				})
				.eachPage(
					// This function (`page`) will get called for each page of records.
					function page(records, processNextPage) {
						for (const record of records) {
							// Get the submission ids
							const submissionIds = record.get(SUBMISSION_IDS);

							// Type narrowing to ensure the submission ids are an array of strings
							if (
								!Array.isArray(submissionIds)
								|| !submissionIds.every((item) => typeof item === "string")
								|| !submissionIds.length
							) {
								continue;
							}

							// Get the grades
							const grades = submissionIds
								.map((id) => {
									// Get the start year
									const startYear = submissions[id];

									// If the start year is not truthy or NaN, skip the record
									if (!startYear || Number.isNaN(startYear)) return undefined;

									// If after August 1st, use the next year for grade calculation
									// (the first grade is "0. klasse")
									const now = new Date();
									const year = now.getFullYear();
									const month = now.getMonth(); // 0 = January, 6 = July
									const schoolYear = month > 6 ? year + 1 : year;

									// Calculate the grade by subtracting the start year from the current year
									const grade = schoolYear - startYear;
									if (grade < 0 || grade > 9) return undefined;

									// Return the grade as a string
									return `${grade}. klasse`;
								})
								.filter((grade) => typeof grade === "string")
								.reduce<Record<string, number>>((grades, grade) => {
									// Return the grades as a record with the grade as the key and the number of submissions as the value
									if (grades[grade]) {
										grades[grade] = grades[grade] + 1;
									} else {
										grades[grade] = 1;
									}
									return grades;
								}, {});

							// Fix the longitude and latitude (see `fixGeo`)
							const lng = fixGeo(Number(record.get(LONGITUDE)), [
								MIN_LNG,
								MAX_LNG,
							]);
							const lat = fixGeo(Number(record.get(LATITUDE)), [
								MIN_LAT,
								MAX_LAT,
							]);

							// If the longitude or latitude is NaN, skip the record
							if (Number.isNaN(lng) || Number.isNaN(lat)) {
								continue;
							}

							// Get the fields from the record
							const regionName = record.get(REGION_NAME);
							const regionId = record.get(REGION_ID);
							const municipalityName = record.get(MUNICIPALITY_NAME);
							const municipalityId = record.get(MUNICIPALITY_ID);
							const schoolName = record.get(SCHOOL_NAME);
							const schoolId = record.get(SCHOOL_ID);

							// If any of the fields are missing, skip the record
							if (
								typeof regionName !== "string"
								|| typeof regionId !== "number"
								|| typeof municipalityName !== "string"
								|| typeof municipalityId !== "number"
								|| typeof schoolName !== "string"
								|| typeof schoolId !== "number"
							) {
								continue;
							}

							// Create a new feature
							const feature = point<SchoolProperties>([lng, lat], {
								id: schoolId,
								filter: [],
								name: schoolName,
								subs: submissionIds.length,
								grades,
								m_name: municipalityName,
								m_id: municipalityId,
								r_name: regionName,
								r_id: regionId,
							});

							// Add the feature to the feature collection
							schools.features.push(feature);
						}

						// To fetch the next page of records, call `processNextPage`.
						// If there are more records, this function will get called again.
						// If there are no more records, `done` will get called.
						processNextPage();
					},

					// This function is called when all pages have been fetched
					function done(error) {
						if (error) {
							console.error(error);
							reject(error);
							return;
						}

						clearTimeout(timeout);
						resolve(true);
					},
				);
		}),
	);

	if (error) {
		console.error(error);
	}

	return schools;
};

/**
 * Because the geo data is stored in a weird way we need this odd function to fix it.
 * The latitude and longitude are stored as integer values and the length of the integer varies.
 * The solution I came up with is to continue dividing the number by 10 until it's within the approximate range of Denmarks bounding box.
 * If the number falls out of the range, we return NaN.
 * Very not good solution, but it works I guess.
 */
const fixGeo = (value: number, [min, max]: [number, number]) => {
	let fixed = value;

	while (fixed > max && !Number.isNaN(fixed)) {
		fixed = fixed / 10;
	}

	if (fixed < min) {
		fixed = Number.NaN;
	}

	return truncate(fixed, 5);
};

/**
 * Truncates a number to a certain number of decimal places.
 */
const truncate = (value: number, decimals: number) => {
	return Math.round(value * 10 ** decimals) / 10 ** decimals;
};

const schoolsPromise = getSchools();

/**
 * Reduces the schools collection to a collection of regions.
 */
export async function regionCollection() {
	const schools = await schoolsPromise;
	if (!schools) return undefined;

	// Reduce the features to an array of multi-points based on the region name
	const reducedFeatures = schools.features.reduce<
		Feature<MultiPoint, RegionProperties>[]
	>((features, feature) => {
		const {
			geometry: { coordinates },
			properties: { r_name, r_id, subs },
		} = feature;

		// Find the index of the feature with the same region name
		const index = features.findIndex(
			(feature) => feature.properties.r_name === r_name,
		);

		// Find all municipalities in the region
		const municipalityIds =
			schools.features.reduce<number[]>((acc, feature) => {
				if (
					feature.properties.r_id === r_id
					&& !acc.includes(feature.properties.m_id)
				) {
					acc.push(feature.properties.m_id);
				}
				return acc;
			}, []) ?? [];

		// If the feature does not exist, create a new one
		if (index === -1) {
			const feature = multiPoint([coordinates], {
				id: r_id,
				filter: municipalityIds,
				name: r_name,
				subs,
				r_name,
				r_id,
			});
			features.push(feature);

			return features;
		}

		// If the feature does not exist, return the collection
		if (!features[index]) return features;

		// If the feature exists, update the subs property and coordinates
		features[index].properties.subs = features[index].properties.subs + subs;
		features[index].geometry.coordinates.push(coordinates);

		return features;
	}, []);

	// Return a collection of centroids
	return featureCollection(
		reducedFeatures.map((feature) => {
			const { geometry, properties } = feature;

			// Calculate the centroid from a collection of points
			const collection = featureCollection(
				geometry.coordinates.map((c) => point(c)),
			);
			const centroid = centerMedian(collection);

			// Return the centroid point with the properties
			return point(centroid.geometry.coordinates, properties);
		}),
	);
}

/**
 * Reduces the schools collection to a collection of municipalities.
 */
export async function municipalityCollection() {
	const schools = await schoolsPromise;
	if (!schools) return undefined;

	// Reduce the features to an array of multi-points based on the municipality name
	const reducedFeatures = schools.features.reduce<
		Feature<MultiPoint, MunicipalityProperties>[]
	>((features, feature) => {
		const {
			geometry: { coordinates },
			properties: { m_name, m_id, r_name, r_id, subs },
		} = feature;

		// Find the index of the feature with the same municipality name
		const index = features.findIndex(
			(feature) => feature.properties.m_name === m_name,
		);

		// Find all schools in the municipality
		const schoolIds =
			schools.features.reduce<number[]>((acc, feature) => {
				if (
					feature.properties.m_id === m_id
					&& !acc.includes(feature.properties.id)
				) {
					acc.push(feature.properties.id);
				}
				return acc;
			}, []) ?? [];

		// If the feature does not exist, create a new one, add it to the collection and return the collection
		if (index === -1) {
			const feature = multiPoint([coordinates], {
				id: m_id,
				filter: schoolIds,
				name: m_name,
				subs,
				m_id,
				m_name,
				r_id,
				r_name,
			});
			features.push(feature);

			return features;
		}

		// If the feature does not exist, return the collection
		if (!features[index]) return features;

		// If the feature exists, update the properties and coordinates
		features[index].properties.subs = subs + features[index].properties.subs;
		features[index].geometry.coordinates.push(coordinates);

		return features;
	}, []);

	// Map the features to an array of centroids
	const centroidFeatures = reducedFeatures.map((feature) => {
		const { geometry, properties } = feature;

		// Calculate the centroid from a collection of points
		const collection = featureCollection(
			geometry.coordinates.map((c) => point(c)),
		);
		const centroid = centerMedian(collection);

		// Return the centroid point with the properties
		return point(centroid.geometry.coordinates, properties);
	});

	// Return the filtered centroid collection
	return featureCollection(centroidFeatures);
}

/**
 * This function is just a wrapper for nice semantic naming.
 */
export async function schoolCollection() {
	const schools = await schoolsPromise;
	if (!schools) return undefined;

	return schools;
}
