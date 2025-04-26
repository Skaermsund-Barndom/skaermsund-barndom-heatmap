import type {
	MunicipalityProperties,
	RegionProperties,
	SchoolProperties,
} from "@/scripts/types";
import { centerMedian, featureCollection, multiPoint, point } from "@turf/turf";
import type { FeatureCollection, MultiPoint, Point } from "geojson";

export function regionsCollection(
	schools?: FeatureCollection<Point, SchoolProperties>,
) {
	if (!schools) return undefined;

	// Reduce the features to a collection of multi-points based on the region name
	const reducedCollection = schools.features.reduce((collection, feature) => {
		const {
			geometry: { coordinates },
			properties: { r_name, r_id, subs },
		} = feature;

		// Find the index of the feature with the same region name
		const index = collection.features.findIndex(
			(feature) => feature.properties.r_name === r_name,
		);

		// If the feature does not exist, create a new one
		if (index === -1) {
			const feature = multiPoint([coordinates], {
				r_name,
				r_id,
				subs,
			});
			collection.features.push(feature);

			return collection;
		}

		if (collection.features[index]) {
			collection.features[index].properties = {
				subs: collection.features[index].properties.subs + subs,
				r_name,
				r_id,
			};
			collection.features[index].geometry.coordinates.push(coordinates);
		}

		return collection;
	}, featureCollection<MultiPoint, RegionProperties>([]));

	// Return a collection of centroids
	return featureCollection(
		reducedCollection.features.map((feature) => {
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

export function municipalitiesCollection(
	schools?: FeatureCollection<Point, SchoolProperties>,
) {
	if (!schools) return undefined;

	// Reduce the features to a collection of multi-points based on the municipality name
	const reducedCollection = schools.features.reduce((collection, feature) => {
		const {
			geometry: { coordinates },
			properties: { m_name, m_id, r_name, r_id, subs },
		} = feature;

		// Find the index of the feature with the same municipality name
		const index = collection.features.findIndex(
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
			collection.features.push(feature);

			return collection;
		}

		// If the feature does not exist, return the collection
		if (!collection.features[index]) return collection;

		// If the feature exists, update the properties and coordinates
		collection.features[index].properties = {
			subs: subs + collection.features[index].properties.subs,
			m_name,
			m_id,
			r_name,
			r_id,
		};
		collection.features[index].geometry.coordinates.push(coordinates);

		return collection;
	}, featureCollection<MultiPoint, MunicipalityProperties>([]));

	// Return a collection of centroids
	return featureCollection(
		reducedCollection.features.map((feature) => {
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
