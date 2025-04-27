import { store } from "@/scripts/store";
import type { MunicipalityProperties, RegionProperties } from "@/scripts/types";
import { centerMedian, featureCollection, multiPoint, point } from "@turf/turf";

export function regionsCollection() {
	// Reduce the features to an array of multi-points based on the region name
	const reducedFeatures = store.schools?.features.reduce(
		(features, feature) => {
			const {
				geometry: { coordinates },
				properties: { r_name, r_id, subs },
			} = feature;

			// Find the index of the feature with the same region name
			const index = features.findIndex(
				(feature) => feature.properties.r_name === r_name,
			);

			// If the feature does not exist, create a new one
			if (index === -1) {
				const feature = multiPoint([coordinates], {
					r_name,
					r_id,
					subs,
				});
				features.push(feature);

				return features;
			}

			if (features[index]) {
				features[index].properties.subs =
					features[index].properties.subs + subs;
				features[index].geometry.coordinates.push(coordinates);
			}

			return features;
		},
		[] as ReturnType<typeof multiPoint<RegionProperties>>[],
	);

	// Return a collection of centroids
	return featureCollection(
		reducedFeatures?.map((feature) => {
			const { geometry, properties } = feature;

			// Calculate the centroid from a collection of points
			const collection = featureCollection(
				geometry.coordinates.map((c) => point(c)),
			);
			const centroid = centerMedian(collection);

			// Return the centroid point with the properties
			return point(centroid.geometry.coordinates, properties);
		}) ?? [],
	);
}

export function municipalitiesCollection() {
	// Reduce the features to an array of multi-points based on the municipality name
	const reducedFeatures = store.schools?.features.reduce(
		(features, feature) => {
			const {
				geometry: { coordinates },
				properties: { m_name, m_id, r_name, r_id, subs },
			} = feature;

			// Find the index of the feature with the same municipality name
			const index = features.findIndex(
				(feature) => feature.properties.m_name === m_name,
			);

			// If the feature does not exist, create a new one, add it to the collection and return the collection
			if (index === -1) {
				const feature = multiPoint([coordinates], {
					m_name,
					m_id,
					r_name,
					r_id,
					subs,
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
		},
		[] as ReturnType<typeof multiPoint<MunicipalityProperties>>[],
	);

	// Map the features to an array of centroids
	const centroidFeatures = reducedFeatures?.map((feature) => {
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
	return featureCollection(
		centroidFeatures?.filter(
			(f) =>
				!store.activeRegionId || f.properties.r_id === store.activeRegionId,
		) ?? [],
	);
}

export function schoolsCollection() {
	// Return the filtered schools collection
	return featureCollection(
		store.schools?.features.filter(
			(f) =>
				(!store.activeRegionId || f.properties.r_id === store.activeRegionId)
				&& (!store.activeMunicipalityId
					|| f.properties.m_id === store.activeMunicipalityId),
		) ?? [],
	);
}
