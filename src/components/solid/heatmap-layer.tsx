import { GeoJSONSource } from "@/components/maplibre/geojson-source";
import { Layer } from "@/components/maplibre/layer";
import { hoverOpacity } from "@/components/solid/heatmap-layers";
import { TooltipMarker } from "@/components/solid/tooltip-marker";
import { COLORS, FONT_STACK } from "@/scripts/const";
import { type geojsonSource, interpolate } from "@/scripts/helpers";
import { setStore, store } from "@/scripts/store";
import type { HeatmapProps } from "@/scripts/types";
import { LngLat, type MapLayerMouseEvent } from "maplibre-gl";
import {
	type VoidComponent,
	createEffect,
	createMemo,
	createSignal,
} from "solid-js";
import { createStore } from "solid-js/store";

interface Props extends HeatmapProps {
	source: ReturnType<typeof geojsonSource>;
	sourceId: string;
	circleLayerId: string;
	textLayerId: string;
	circleActiveLayerId: string;
	textActiveLayerId: string;
	circleMinRadius: number;
	circleMaxRadius: number;
	textMinSize: number;
	textMaxSize: number;
	zoomLevels: {
		minzoom: number;
		maxzoom: number;
	};
	name: string;
	storeIdentifier: keyof typeof store;
}

export const HeatmapLayer: VoidComponent<Props> = (props) => {
	// Active feature id (used to check if the active feature has changed with mousemove)
	const [activeFeatureId, setActiveFeatureId] = createSignal<number | string>();

	// Marker store
	const [marker, setMarker] = createStore({
		lngLat: undefined as LngLat | undefined,
		offset: 0,
		text: "",
	});

	// Get the minimum and maximum submissions for the features
	const minSubmissions = createMemo(() =>
		Math.min(
			...props.source.data.features.map((f) => f.properties?.submissions),
		),
	);
	const maxSubmissions = createMemo(() =>
		Math.max(
			...props.source.data.features.map((f) => f.properties?.submissions),
		),
	);

	// When the mouse moves over a feature, set the active feature id
	const mousemove = (event: MapLayerMouseEvent) => {
		const feature = event.features?.[0];
		if (feature?.geometry.type !== "Point") return;

		if (activeFeatureId() !== feature.id) {
			setActiveFeatureId(feature.id);
			setStore(props.storeIdentifier, undefined);
		}

		if (store[props.storeIdentifier] === feature.properties[props.name]) return;
		setStore(props.storeIdentifier, feature.properties[props.name]);
	};

	// When the active feature id changes, update the marker and the feature state
	createEffect(() => {
		const activeFeatureName = store[props.storeIdentifier];
		if (!activeFeatureName) return;

		const feature = props.map
			.querySourceFeatures(props.sourceId)
			.find((f) => f.properties[props.name] === activeFeatureName);
		if (!feature) return;

		const [lng, lat] =
			feature.geometry.type === "Point" ? feature.geometry.coordinates : [0, 0];
		if (!lng || !lat) return;

		const lngLat = new LngLat(lng, lat);
		const offset = interpolate(
			feature.properties.submissions,
			minSubmissions(),
			props.circleMinRadius,
			maxSubmissions(),
			props.circleMaxRadius,
		);

		setMarker({
			lngLat,
			offset,
			text: feature.properties[props.name],
		});

		const featureIdentifier = {
			id: feature.id,
			source: props.sourceId,
		};
		props.map.setFeatureState(featureIdentifier, { hover: true });
	});

	// When the mouse leaves a feature, reset the active feature id
	const mouseleave = () => {
		setStore(props.storeIdentifier, undefined);
	};

	// When the active feature id is undefined, reset the marker and the feature state
	createEffect(() => {
		if (store[props.storeIdentifier]) return;

		setMarker({
			lngLat: undefined,
			offset: 0,
			text: "",
		});

		const features = props.map.querySourceFeatures(props.sourceId);
		for (const feature of features) {
			const featureIdentifier = {
				id: feature.id,
				source: props.sourceId,
			};
			props.map.setFeatureState(featureIdentifier, { hover: false });
		}
	});

	return (
		<>
			{/* Tooltip marker with name */}
			<TooltipMarker
				map={props.map}
				lngLat={marker.lngLat}
				offset={marker.offset}
				text={marker.text}
			/>

			{/* Source */}
			<GeoJSONSource id={props.sourceId} map={props.map} source={props.source}>
				{/* Circle layer */}
				<Layer
					map={props.map}
					events={{
						mousemove,
						mouseleave,
					}}
					layer={{
						...props.zoomLevels,
						id: props.circleLayerId,
						type: "circle",
						source: props.sourceId,
						paint: {
							"circle-color": COLORS["--color-primary"],
							"circle-radius": [
								"interpolate",
								["linear"],
								["get", "submissions"],
								minSubmissions(),
								props.circleMinRadius,
								maxSubmissions(),
								props.circleMaxRadius,
							],
						},
					}}
				/>

				{/* Text layer */}
				<Layer
					map={props.map}
					layer={{
						...props.zoomLevels,
						id: props.textLayerId,
						type: "symbol",
						source: props.sourceId,
						layout: {
							"text-field": ["get", "submissions"],
							"text-font": FONT_STACK,
							"text-overlap": "always",
							"text-size": [
								"interpolate",
								["linear"],
								["get", "submissions"],
								minSubmissions(),
								props.textMinSize,
								maxSubmissions(),
								props.textMaxSize,
							],
						},
						paint: {
							"text-color": COLORS["--color-container"],
						},
					}}
				/>

				{/* Active circle (renders on top) */}
				<Layer
					map={props.map}
					layer={{
						...props.zoomLevels,
						id: props.circleActiveLayerId,
						type: "circle",
						source: props.sourceId,
						paint: {
							"circle-opacity": hoverOpacity,
							"circle-color": COLORS["--color-primary-80"],
							"circle-radius": [
								"interpolate",
								["linear"],
								["get", "submissions"],
								minSubmissions(),
								props.circleMinRadius,
								maxSubmissions(),
								props.circleMaxRadius,
							],
						},
					}}
				/>

				{/* Active text (renders on top) */}
				<Layer
					map={props.map}
					layer={{
						...props.zoomLevels,
						id: props.textActiveLayerId,
						type: "symbol",
						source: props.sourceId,
						layout: {
							"text-field": ["get", "submissions"],
							"text-font": FONT_STACK,
							"text-overlap": "always",
							"text-size": [
								"interpolate",
								["linear"],
								["get", "submissions"],
								minSubmissions(),
								props.textMinSize,
								maxSubmissions(),
								props.textMaxSize,
							],
						},
						paint: {
							"text-opacity": hoverOpacity,
							"text-color": COLORS["--color-container"],
						},
					}}
				/>
			</GeoJSONSource>
		</>
	);
};
