import { HeatmapLayer } from "@/components/solid/heatmap-layer";
import { AppContext } from "@/scripts/app-context";
import { ZOOM_LEVELS } from "@/scripts/const";
import { geojsonSource } from "@/scripts/helpers";
import type { MapProps } from "@/scripts/types";
import { centerMedian, featureCollection, multiPoint, point } from "@turf/turf";
import type { MultiPoint } from "geojson";
import { type VoidComponent, createMemo, useContext } from "solid-js";

interface RegionProperties {
	subs: number;
	r_name: string;
	r_id: number;
}

interface MunicipalityProperties {
	subs: number;
	m_name: string;
	m_id: number;
}

interface Props extends MapProps {}

export const HeatmapLayers: VoidComponent<Props> = (props) => {
	const appStore = useContext(AppContext);

	const regionsCollection = createMemo(() => {
		const features = appStore?.schools?.features;
		if (!features) return;

		// Reduce the features to a collection of multi-points based on the region name
		const reducedCollection = features.reduce((collection, feature) => {
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
	});

	const municipalitiesCollection = createMemo(() => {
		const features = appStore?.schools?.features;
		if (!features) return undefined;

		// Reduce the features to a collection of multi-points based on the municipality name
		const reducedCollection = features.reduce((collection, feature) => {
			const {
				geometry: { coordinates },
				properties: { m_name, m_id, subs },
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
	});

	return (
		<>
			{/* Regions */}
			<HeatmapLayer
				map={props.map}
				source={geojsonSource(regionsCollection(), "r_id")}
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
				name="r_name"
				id="r_id"
				storeIdentifier="hoverRegionId"
			/>

			{/* Municipalities */}
			<HeatmapLayer
				map={props.map}
				source={geojsonSource(municipalitiesCollection(), "m_id")}
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
				name="m_name"
				id="m_id"
				storeIdentifier="hoverMunicipalityId"
			/>

			{/* Schools */}
			<HeatmapLayer
				map={props.map}
				source={geojsonSource(appStore?.schools, "s_id")}
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
				name="s_name"
				id="s_id"
				storeIdentifier="hoverSchoolId"
			/>
		</>
	);
};
