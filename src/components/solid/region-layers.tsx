import { GeoJSONSource } from "@/components/maplibre/geojson-source";
import { Layer } from "@/components/maplibre/layer";
import { COLORS, FONT_STACK, ZOOM_LEVELS } from "@/scripts/const";
import { geojsonSource } from "@/scripts/helpers";
import type { HeatmapProps } from "@/scripts/types";
import { centerMedian, featureCollection, multiPoint, point } from "@turf/turf";
import type { MultiPoint } from "geojson";
import type { VoidComponent } from "solid-js";
import { createMemo } from "solid-js";

const REGION_SOURCE = "regions";
const REGION_CIRCLE_LAYER = "regions-circle";
const REGION_TEXT_LAYER = "regions-text";
const ZOOMS = {
	minzoom: ZOOM_LEVELS.REGION,
	maxzoom: ZOOM_LEVELS.MUNICIPALITY,
} as const;

interface Props extends HeatmapProps {}

interface RegionProperties {
	submissions: number;
	region_name: string;
}

export const RegionLayers: VoidComponent<Props> = (props) => {
	const regions = createMemo(() => {
		const regionCollection = props.schools.features.reduce(
			(collection, feature) => {
				const {
					geometry: { coordinates },
					properties: { region_name, submissions },
				} = feature;

				const index = collection.features.findIndex(
					(feature) => feature.properties.region_name === region_name,
				);
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
			},
			featureCollection<MultiPoint, RegionProperties>([]),
		);

		return featureCollection(
			regionCollection.features.map((feature) => {
				const { geometry, properties } = feature;

				const collection = featureCollection(
					geometry.coordinates.map((c) => point(c)),
				);
				const centroid = centerMedian(collection);
				return point(centroid.geometry.coordinates, properties);
			}),
		);
	});

	const regionMax = createMemo(() =>
		Math.max(...regions().features.map((f) => f.properties.submissions)),
	);

	const regionMin = createMemo(() =>
		Math.min(...regions().features.map((f) => f.properties.submissions)),
	);

	return (
		<GeoJSONSource
			id={REGION_SOURCE}
			map={props.map}
			source={geojsonSource(regions())}
		>
			<Layer
				map={props.map}
				layer={{
					...ZOOMS,
					id: REGION_CIRCLE_LAYER,
					type: "circle",
					source: REGION_SOURCE,
					paint: {
						"circle-color": COLORS["--color-primary"],
						"circle-radius": [
							"interpolate",
							["linear"],
							["get", "submissions"],
							regionMin(),
							20,
							regionMax(),
							60,
						],
					},
				}}
			/>
			<Layer
				map={props.map}
				layer={{
					...ZOOMS,
					id: REGION_TEXT_LAYER,
					type: "symbol",
					source: REGION_SOURCE,
					layout: {
						"text-field": ["get", "submissions"],
						"text-font": FONT_STACK,
						"text-size": [
							"interpolate",
							["linear"],
							["get", "submissions"],
							regionMin(),
							14,
							regionMax(),
							20,
						],
					},
					paint: {
						"text-color": "#ffffff",
					},
				}}
			/>
		</GeoJSONSource>
	);
};
