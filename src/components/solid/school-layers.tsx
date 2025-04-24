import { GeoJSONSource } from "@/components/maplibre/geojson-source";
import { Layer } from "@/components/maplibre/layer";
import { hoverOpacity } from "@/components/solid/heatmap-layers";
import { TooltipMarker } from "@/components/solid/tooltip-marker";
import { COLORS, FONT_STACK, ZOOM_LEVELS } from "@/scripts/const";
import { geojsonSource, interpolate } from "@/scripts/helpers";
import type { HeatmapProps } from "@/scripts/types";
import { LngLat, type MapLayerMouseEvent } from "maplibre-gl";
import { type VoidComponent, createMemo, createSignal } from "solid-js";

const SCHOOL_SOURCE = "schools";
const SCHOOL_CIRCLE_LAYER = "schools-circle";
const SCHOOL_CIRCLE_ACTIVE_LAYER = "schools-circle-active";
const SCHOOL_TEXT_LAYER = "schools-text";
const SCHOOL_TEXT_ACTIVE_LAYER = "schools-text-active";
const ZOOMS = {
	minzoom: ZOOM_LEVELS.SCHOOL,
	maxzoom: ZOOM_LEVELS.MAX,
} as const;
const SCHOOL_CIRCLE_MIN_RADIUS = 10;
const SCHOOL_CIRCLE_MAX_RADIUS = 40;
const SCHOOL_TEXT_MIN_SIZE = 12;
const SCHOOL_TEXT_MAX_SIZE = 18;

interface Props extends HeatmapProps {}

export const SchoolLayers: VoidComponent<Props> = (props) => {
	const [activeId, setActiveId] = createSignal<number | string>();
	const [markerLngLat, setMarkerLngLat] = createSignal<LngLat>();
	const [markerOffset, setMarkerOffset] = createSignal(0);
	const [markerText, setMarkerText] = createSignal("");

	const minSubmissions = createMemo(() =>
		Math.min(...props.schools.features.map((f) => f.properties.submissions)),
	);

	const maxSubmissions = createMemo(() =>
		Math.max(...props.schools.features.map((f) => f.properties.submissions)),
	);

	const mousemove = (event: MapLayerMouseEvent) => {
		const feature = event.features?.[0];
		if (feature?.geometry.type !== "Point" || !feature.id) return;

		if (activeId() !== feature.id) {
			setActiveId(feature.id);
			mouseleave();
		}

		const [lng, lat] = feature.geometry.coordinates;
		if (!lng || !lat) return;

		const lngLat = new LngLat(lng, lat);
		setMarkerLngLat(lngLat);

		const offset = interpolate(
			feature.properties.submissions,
			minSubmissions(),
			SCHOOL_CIRCLE_MIN_RADIUS,
			maxSubmissions(),
			SCHOOL_CIRCLE_MAX_RADIUS,
		);
		setMarkerOffset(offset);
		setMarkerText(feature.properties.school_name);

		props.map.setFeatureState(
			{
				id: feature.id,
				source: SCHOOL_SOURCE,
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

		const features = props.map.querySourceFeatures(SCHOOL_SOURCE);
		for (const feature of features) {
			props.map.setFeatureState(
				{
					id: feature.id,
					source: SCHOOL_SOURCE,
				},
				{
					hover: false,
				},
			);
		}
	};

	return (
		<GeoJSONSource
			id={SCHOOL_SOURCE}
			map={props.map}
			source={geojsonSource(props.schools, "school_name")}
		>
			<TooltipMarker
				map={props.map}
				lngLat={markerLngLat()}
				offset={markerOffset()}
				text={markerText()}
			/>
			<Layer
				map={props.map}
				events={{
					mousemove,
					mouseleave,
				}}
				layer={{
					...ZOOMS,
					id: SCHOOL_CIRCLE_LAYER,
					type: "circle",
					source: SCHOOL_SOURCE,
					paint: {
						"circle-color": COLORS["--color-primary"],
						"circle-radius": [
							"interpolate",
							["linear"],
							["get", "submissions"],
							minSubmissions(),
							SCHOOL_CIRCLE_MIN_RADIUS,
							maxSubmissions(),
							SCHOOL_CIRCLE_MAX_RADIUS,
						],
					},
				}}
			/>
			<Layer
				map={props.map}
				layer={{
					...ZOOMS,
					id: SCHOOL_TEXT_LAYER,
					type: "symbol",
					source: SCHOOL_SOURCE,
					layout: {
						"text-field": ["get", "submissions"],
						"text-font": FONT_STACK,
						"text-overlap": "always",
						"text-size": [
							"interpolate",
							["linear"],
							["get", "submissions"],
							minSubmissions(),
							SCHOOL_TEXT_MIN_SIZE,
							maxSubmissions(),
							SCHOOL_TEXT_MAX_SIZE,
						],
					},
					paint: {
						"text-color": COLORS["--color-container"],
					},
				}}
			/>
			<Layer
				map={props.map}
				events={{
					mousemove,
					mouseleave,
				}}
				layer={{
					...ZOOMS,
					id: SCHOOL_CIRCLE_ACTIVE_LAYER,
					type: "circle",
					source: SCHOOL_SOURCE,
					paint: {
						"circle-opacity": hoverOpacity,
						"circle-color": COLORS["--color-primary-80"],
						"circle-radius": [
							"interpolate",
							["linear"],
							["get", "submissions"],
							minSubmissions(),
							SCHOOL_CIRCLE_MIN_RADIUS,
							maxSubmissions(),
							SCHOOL_CIRCLE_MAX_RADIUS,
						],
					},
				}}
			/>
			<Layer
				map={props.map}
				layer={{
					...ZOOMS,
					id: SCHOOL_TEXT_ACTIVE_LAYER,
					type: "symbol",
					source: SCHOOL_SOURCE,
					layout: {
						"text-field": ["get", "submissions"],
						"text-font": FONT_STACK,
						"text-overlap": "always",
						"text-size": [
							"interpolate",
							["linear"],
							["get", "submissions"],
							minSubmissions(),
							SCHOOL_TEXT_MIN_SIZE,
							maxSubmissions(),
							SCHOOL_TEXT_MAX_SIZE,
						],
					},
					paint: {
						"text-opacity": hoverOpacity,
						"text-color": COLORS["--color-container"],
					},
				}}
			/>
		</GeoJSONSource>
	);
};
