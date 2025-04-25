import { HeatmapLayer } from "@/components/solid/heatmap-layer";
import { ZOOM_LEVELS } from "@/scripts/const";
import { geojsonSource } from "@/scripts/helpers";
import type { MapProps, SchoolCollection } from "@/scripts/types";
import { centerMedian, featureCollection, multiPoint, point } from "@turf/turf";
import type { MultiPoint } from "geojson";
import { type VoidComponent, createMemo, createResource } from "solid-js";

interface RegionProperties {
	submissions: number;
	region_name: string;
}

interface MunicipalityProperties {
	submissions: number;
	municipality_name: string;
}

interface Props extends MapProps {}

export const HeatmapLayers: VoidComponent<Props> = (props) => {
	const [schools] = createResource<SchoolCollection>(async () => {
		const response = await fetch("/api/schools.json");
		const data = await response.json();
		return data;
	});

	const regions = createMemo(() => {
		const features = schools()?.features;
		if (!features) return;

		const reducedCollection = features.reduce((collection, feature) => {
			const {
				geometry: { coordinates },
				properties: { region_name, submissions },
			} = feature;

			// Find the index of the feature with the same region name
			const index = collection.features.findIndex(
				(feature) => feature.properties.region_name === region_name,
			);

			// If the feature does not exist, create a new one
			if (index === -1) {
				const feature = multiPoint([coordinates], {
					region_name,
					submissions,
				});
				collection.features.push(feature);

				return collection;
			}

			if (collection.features[index]) {
				collection.features[index].properties = {
					submissions:
						collection.features[index].properties.submissions + submissions,
					region_name,
				};
				collection.features[index].geometry.coordinates.push(coordinates);
			}

			return collection;
		}, featureCollection<MultiPoint, RegionProperties>([]));

		// Create a collection of centroids
		const centroidCollection = featureCollection(
			reducedCollection.features.map((feature) => {
				const { geometry, properties } = feature;

				const collection = featureCollection(
					geometry.coordinates.map((c) => point(c)),
				);
				const centroid = centerMedian(collection);
				return point(centroid.geometry.coordinates, properties);
			}),
		);

		return centroidCollection;
	});

	const municipalities = createMemo(() => {
		const features = schools()?.features;
		if (!features) return undefined;

		const reducedCollection = features.reduce((collection, feature) => {
			const {
				geometry: { coordinates },
				properties: { municipality_name, submissions },
			} = feature;

			// Find the index of the feature with the same municipality name
			const index = collection.features.findIndex(
				(feature) => feature.properties.municipality_name === municipality_name,
			);

			// If the feature does not exist, create a new one, add it to the collection and return the collection
			if (index === -1) {
				const feature = multiPoint([coordinates], {
					municipality_name,
					submissions,
				});
				collection.features.push(feature);

				return collection;
			}

			// If the feature does not exist, return the collection
			if (!collection.features[index]) return collection;

			// If the feature exists, update the properties and coordinates
			collection.features[index].properties = {
				submissions:
					submissions + collection.features[index].properties.submissions,
				municipality_name,
			};
			collection.features[index].geometry.coordinates.push(coordinates);

			return collection;
		}, featureCollection<MultiPoint, MunicipalityProperties>([]));

		// Create a collection of centroids
		const centroidCollection = featureCollection(
			reducedCollection.features.map((feature) => {
				const { geometry, properties } = feature;

				// Create a collection of points
				const collection = featureCollection(
					geometry.coordinates.map((c) => point(c)),
				);

				// Calculate the centroid
				const centroid = centerMedian(collection);

				// Return the centroid point with the properties
				const centroidPoint = point(centroid.geometry.coordinates, properties);
				return centroidPoint;
			}),
		);

		return centroidCollection;
	});

	return (
		<>
			<HeatmapLayer
				map={props.map}
				source={geojsonSource(regions(), "region_name")}
				sourceId="regions"
				circleLayerId="regions-circle"
				textLayerId="regions-text"
				circleActiveLayerId="regions-circle-active"
				textActiveLayerId="regions-text-active"
				circleMinRadius={20}
				circleMaxRadius={60}
				textMinSize={14}
				textMaxSize={20}
				zoomLevels={{
					minzoom: ZOOM_LEVELS.REGION,
					maxzoom: ZOOM_LEVELS.MUNICIPALITY,
				}}
				name="region_name"
				storeIdentifier="activeRegionName"
			/>
			<HeatmapLayer
				map={props.map}
				source={geojsonSource(municipalities(), "municipality_name")}
				sourceId="municipalities"
				circleLayerId="municipalities-circle"
				textLayerId="municipalities-text"
				circleActiveLayerId="municipalities-circle-active"
				textActiveLayerId="municipalities-text-active"
				circleMinRadius={20}
				circleMaxRadius={60}
				textMinSize={14}
				textMaxSize={20}
				zoomLevels={{
					minzoom: ZOOM_LEVELS.MUNICIPALITY,
					maxzoom: ZOOM_LEVELS.SCHOOL,
				}}
				name="municipality_name"
				storeIdentifier="activeMunicipalityName"
			/>
			<HeatmapLayer
				map={props.map}
				source={geojsonSource(schools(), "school_name")}
				sourceId="schools"
				circleLayerId="schools-circle"
				textLayerId="schools-text"
				circleActiveLayerId="schools-circle-active"
				textActiveLayerId="schools-text-active"
				circleMinRadius={10}
				circleMaxRadius={40}
				textMinSize={12}
				textMaxSize={18}
				zoomLevels={{
					minzoom: ZOOM_LEVELS.SCHOOL,
					maxzoom: ZOOM_LEVELS.MAX,
				}}
				name="school_name"
				storeIdentifier="activeSchoolName"
			/>
		</>
	);
};
