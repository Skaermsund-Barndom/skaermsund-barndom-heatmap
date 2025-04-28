import { tryCatch } from "@/scripts/try-catch";
import type { SchoolProperties } from "@/scripts/types";
import { featureCollection, point } from "@turf/turf";
import Airtable from "airtable";
import type { FeatureCollection, Point } from "geojson";

const SUBMISSIONS = "skole-class-fn Rollup (from Submissions 2)";
const REGION_NAME = "BEL_REGION_TEKST";
const REGION_ID = "BEL_REGION";
const MUNICIPALITY_NAME = "KOMMUNE";
const MUNICIPALITY_ID = "BEL_KOMMUNE";
const SCHOOL_NAME = "INST_NAVN";
const SCHOOL_ID = "INST_NR";
const LATITUDE = "GEO_BREDDE_GRAD";
const LONGITUDE = "GEO_LAENGDE_GRAD";

const MIN_LAT = 54.54105080166195;
const MAX_LAT = 57.770218411476634;
const MIN_LNG = 8.052716042949726;
const MAX_LNG = 15.210410477270017;

const base = new Airtable({ apiKey: import.meta.env.AIRTABLE_API_KEY }).base(
	"appFpQHfnl4TDWh4c",
);

export const schools = async () => {
	const schools: FeatureCollection<Point, SchoolProperties> = featureCollection(
		[],
	);

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
					(records, processNextPage) => {
						for (const record of records) {
							const submissions = Number(record.get(SUBMISSIONS));

							if (Number.isNaN(submissions) || submissions === 0) {
								continue;
							}

							const lng = fixGeo(Number(record.get(LONGITUDE)), [
								MIN_LNG,
								MAX_LNG,
							]);
							const lat = fixGeo(Number(record.get(LATITUDE)), [
								MIN_LAT,
								MAX_LAT,
							]);

							if (Number.isNaN(lng) || Number.isNaN(lat)) {
								continue;
							}

							const regionName = record.get(REGION_NAME);
							const regionId = record.get(REGION_ID);
							const municipalityName = record.get(MUNICIPALITY_NAME);
							const municipalityId = record.get(MUNICIPALITY_ID);
							const schoolName = record.get(SCHOOL_NAME);
							const schoolId = record.get(SCHOOL_ID);

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

							const feature = point<SchoolProperties>([lng, lat], {
								id: schoolId,
								filter: [],
								name: schoolName,
								m_name: municipalityName,
								m_id: municipalityId,
								r_name: regionName,
								r_id: regionId,
								subs: submissions,
							});

							schools.features.push(feature);
						}

						// To fetch the next page of records, call `processNextPage`.
						// If there are more records, `page` will get called again.
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

	if (error) {
		console.error(error);
		return;
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

const truncate = (value: number, decimals: number) => {
	return Math.round(value * 10 ** decimals) / 10 ** decimals;
};
