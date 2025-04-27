import { ALL_ID } from "@/scripts/const";
import { store } from "@/scripts/store";
import type { MunicipalityProperties, RegionProperties } from "@/scripts/types";
import { centerMedian, featureCollection, multiPoint, point } from "@turf/turf";
import type { Feature, MultiPoint } from "geojson";

export function regionsCollection() {
	if (!store.schools) return undefined;

	// Reduce the features to an array of multi-points based on the region name
	const reducedFeatures = store.schools.features.reduce<
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

		// If the feature does not exist, create a new one
		if (index === -1) {
			const feature = multiPoint([coordinates], {
				name: r_name,
				id: r_id,
				subs,
				r_name,
				r_id,
			});
			features.push(feature);

			return features;
		}

		if (features[index]) {
			features[index].properties.subs = features[index].properties.subs + subs;
			features[index].geometry.coordinates.push(coordinates);
		}

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

export function municipalitiesCollection() {
	if (!store.schools) return undefined;

	// Reduce the features to an array of multi-points based on the municipality name
	const reducedFeatures = store.schools.features.reduce<
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

		// If the feature does not exist, create a new one, add it to the collection and return the collection
		if (index === -1) {
			const feature = multiPoint([coordinates], {
				id: m_id,
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
	return featureCollection(
		centroidFeatures?.filter(
			(f) =>
				store.activeRegionId === ALL_ID
				|| f.properties.r_id === store.activeRegionId,
		),
	);
}

export function schoolsCollection() {
	if (!store.schools) return undefined;

	// Return the filtered schools collection
	return featureCollection(
		store.schools.features.filter(
			(f) =>
				store.activeMunicipalityId === ALL_ID
				|| f.properties.m_id === store.activeMunicipalityId,
		),
	);
}
