import { getSchools } from "@/scripts/data";
import type { MunicipalityProperties, RegionProperties } from "@/scripts/types";
import { centerMedian, featureCollection, multiPoint, point } from "@turf/turf";
import type { Feature, MultiPoint } from "geojson";

const schools = await getSchools();

/**
 * Reduces the schools collection to a collection of regions.
 */
export async function getRegionCollection() {
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
export async function getMunicipalityCollection() {
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
export async function getSchoolCollection() {
	if (!schools) return undefined;

	return schools;
}
