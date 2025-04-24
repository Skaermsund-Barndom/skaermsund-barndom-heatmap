import { GeoJSONSource } from "@/components/maplibre/geojson-source";
import { Layer } from "@/components/maplibre/layer";
import { COLORS, FONT_STACK, ZOOM_LEVELS } from "@/scripts/const";
import { geojsonSource, interpolate } from "@/scripts/helpers";
import type { HeatmapProps } from "@/scripts/types";
import { centerMedian, featureCollection, multiPoint, point } from "@turf/turf";
import type { MultiPoint } from "geojson";
import { LngLat, type MapLayerMouseEvent } from "maplibre-gl";
import type { VoidComponent } from "solid-js";
import { createMemo, createSignal } from "solid-js";
import { Marker } from "../maplibre/marker";

const REGION_SOURCE = "regions";
const REGION_CIRCLE_LAYER = "regions-circle";
const REGION_TEXT_LAYER = "regions-text";
const ZOOMS = {
	minzoom: ZOOM_LEVELS.REGION,
	maxzoom: ZOOM_LEVELS.MUNICIPALITY,
} as const;
const REGION_CIRCLE_MIN_RADIUS = 20;
const REGION_CIRCLE_MAX_RADIUS = 60;
const REGION_TEXT_MIN_SIZE = 14;
const REGION_TEXT_MAX_SIZE = 20;

interface Props extends HeatmapProps {}

interface RegionProperties {
	submissions: number;
	region_name: string;
}

export const RegionLayers: VoidComponent<Props> = (props) => {
	const [markerLngLat, setMarkerLngLat] = createSignal<LngLat>();
	const [markerOffset, setMarkerOffset] = createSignal(0);
	const [markerText, setMarkerText] = createSignal("");

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

	const mouseenter = (event: MapLayerMouseEvent) => {
		const feature = event.features?.[0];
		if (feature?.geometry.type !== "Point") return;

		const [lng, lat] = feature.geometry.coordinates;
		if (!lng || !lat) return;

		const lngLat = new LngLat(lng, lat);
		setMarkerLngLat(lngLat);

		const offset = interpolate(
			feature.properties.submissions,
			regionMin(),
			regionMax(),
			REGION_CIRCLE_MIN_RADIUS,
			REGION_CIRCLE_MAX_RADIUS,
		);
		setMarkerOffset(offset);
		setMarkerText(feature.properties.region_name);

		props.map.setFeatureState(
			{
				id: feature.id,
				source: REGION_SOURCE,
			},
			{
				hover: true,
			},
		);
	};

	const mouseleave = () => {
		setMarkerLngLat();
		setMarkerOffset(0);
		setMarkerText("");

		const features = props.map.querySourceFeatures(REGION_SOURCE);
		for (const feature of features) {
			props.map.setFeatureState(
				{
					id: feature.id,
					source: REGION_SOURCE,
				},
				{
					hover: false,
				},
			);
		}
	};

	const click = (event: MapLayerMouseEvent) => {
		console.log(event.features);
	};

	return (
		<GeoJSONSource
			id={REGION_SOURCE}
			map={props.map}
			source={geojsonSource(regions())}
		>
			<Marker
				map={props.map}
				lngLat={markerLngLat()}
				class="pointer-events-none"
			>
				<div
					class="bg-primary-80 text-container relative rounded-xl px-3 py-2 text-sm"
					style={{
						transform: `translateY(calc(-${markerOffset()}px - 50% - 0.5rem))`,
					}}
				>
					<span
						class="bg-primary-80 absolute bottom-[1px] left-[50%] h-2 w-4 translate-x-[-50%] translate-y-full"
						style={{
							"clip-path": "polygon(0% 0%, 100% 0%, 50% 100%)",
						}}
					/>
					<span>{markerText()}</span>
				</div>
			</Marker>
			<Layer
				map={props.map}
				events={{
					mouseenter,
					mouseleave,
					click,
				}}
				layer={{
					...ZOOMS,
					id: REGION_CIRCLE_LAYER,
					type: "circle",
					source: REGION_SOURCE,
					paint: {
						"circle-color": [
							"case",
							["boolean", ["feature-state", "hover"], false],
							COLORS["--color-primary-80"],
							COLORS["--color-primary"],
						],
						"circle-radius": [
							"interpolate",
							["linear"],
							["get", "submissions"],
							regionMin(),
							REGION_CIRCLE_MIN_RADIUS,
							regionMax(),
							REGION_CIRCLE_MAX_RADIUS,
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
							REGION_TEXT_MIN_SIZE,
							regionMax(),
							REGION_TEXT_MAX_SIZE,
						],
					},
					paint: {
						"text-color": COLORS["--color-container"],
					},
				}}
			/>
		</GeoJSONSource>
	);
};
