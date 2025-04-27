import { GeoJSONSource } from "@/components/maplibre/geojson-source";
import { Layer } from "@/components/maplibre/layer";
import {
	TooltipMarker,
	type TooltipMarkerStore,
} from "@/components/solid/tooltip-marker";
import {
	ALL_ID,
	BG_HEATMAP_LEVELS_LAYER,
	COLORS,
	FONT_STACK,
} from "@/scripts/const";
import { type geojsonSource, interpolate } from "@/scripts/helpers";
import { hoverStore, setHoverStore, setStore, store } from "@/scripts/store";
import type { Item, MapProps } from "@/scripts/types";
import {
	type FilterSpecification,
	LngLat,
	type MapLayerMouseEvent,
} from "maplibre-gl";
import {
	type VoidComponent,
	createEffect,
	createMemo,
	createSignal,
} from "solid-js";
import { createStore } from "solid-js/store";

interface Props extends MapProps {
	source: ReturnType<typeof geojsonSource>;
	sourceId: string;
	circleMinRadius: number;
	circleMaxRadius: number;
	textMinSize: number;
	textMaxSize: number;
	activeId: keyof typeof store;
	hoverId: keyof typeof hoverStore;
	level: 0 | 1 | 2;
	setLevel: () => void;
}

export const HeatmapLayer: VoidComponent<Props> = (props) => {
	// Active feature id (used to check if the active feature has changed with mousemove)
	const [activeFeatureId, setActiveFeatureId] = createSignal<number | string>();

	const filter = createMemo<FilterSpecification>(() => {
		return ["==", ["number", props.level], ["number", store.level]];
	});

	// Marker store
	const [marker, setMarker] = createStore<TooltipMarkerStore>({
		lngLat: undefined,
		offset: 0,
		name: "",
	});

	// Get the minimum and maximum submissions for the features
	const minSubmissions = createMemo(() =>
		Math.min(0, ...props.source.data.features.map((f) => f.properties?.subs)),
	);
	const maxSubmissions = createMemo(() =>
		Math.max(1, ...props.source.data.features.map((f) => f.properties?.subs)),
	);

	// When the mouse moves over a feature, set the active feature id
	const mousemove = (event: MapLayerMouseEvent) => {
		const feature = event.features?.[0];
		if (feature?.geometry.type !== "Point") return;

		if (activeFeatureId() !== feature.id) {
			setActiveFeatureId(feature.id);
			setHoverStore(props.hoverId, ALL_ID);
		}

		if (hoverStore[props.hoverId] === feature.properties?.id) return;
		setHoverStore(props.hoverId, feature.properties?.id);
	};

	// When the active feature id changes, update the marker and the feature state
	createEffect(() => {
		const activeFeatureId = hoverStore[props.hoverId];
		if (!activeFeatureId) return;

		const feature = props.map
			.querySourceFeatures(props.sourceId)
			.find((f) => f.properties?.id === activeFeatureId);
		if (!feature?.id) return;

		const [lng, lat] =
			feature.geometry.type === "Point" ? feature.geometry.coordinates : [0, 0];
		if (!lng || !lat) return;

		const { name, subs } = feature.properties as Item;
		const lngLat = new LngLat(lng, lat);
		const offset = interpolate(
			subs,
			minSubmissions(),
			props.circleMinRadius,
			maxSubmissions(),
			props.circleMaxRadius,
		);

		setMarker({
			lngLat,
			offset,
			name,
		});

		props.map.setFeatureState(
			{
				id: feature.id,
				source: props.sourceId,
			},
			{
				hover: true,
			},
		);
	});

	// When the mouse leaves a feature, reset the active feature id
	const mouseleave = () => {
		setHoverStore(props.hoverId, ALL_ID);
	};

	// When the active feature id is the all id, reset the marker and the feature state
	createEffect(() => {
		if (hoverStore[props.hoverId] !== ALL_ID) return;

		setMarker({
			lngLat: undefined,
			offset: 0,
			name: "",
		});

		const features = props.map.querySourceFeatures(props.sourceId);
		for (const feature of features) {
			if (!feature.id) continue;
			const featureIdentifier = {
				id: feature.id,
				source: props.sourceId,
			};
			props.map.setFeatureState(featureIdentifier, { hover: false });
		}
	});

	const click = (event: MapLayerMouseEvent) => {
		const feature = event.features?.[0];
		if (feature?.geometry.type !== "Point") return;

		props.setLevel();
		setStore(props.activeId, feature.properties?.id);
	};

	return (
		<>
			{/* Tooltip marker with name */}
			<TooltipMarker
				map={props.map}
				lngLat={marker.lngLat}
				offset={marker.offset}
				name={marker.name}
			/>

			{/* Source */}
			<GeoJSONSource id={props.sourceId} map={props.map} source={props.source}>
				{/* Circle layer */}
				<Layer
					map={props.map}
					beforeId={`${props.sourceId}-text`}
					events={{
						mousemove,
						mouseleave,
						click,
					}}
					layer={{
						id: `${props.sourceId}-circle`,
						type: "circle",
						source: props.sourceId,
						filter: filter(),
						paint: {
							"circle-color": COLORS["--color-primary"],
							"circle-radius": [
								"interpolate",
								["linear"],
								["get", "subs"],
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
					beforeId={`${props.sourceId}-circle-active`}
					layer={{
						id: `${props.sourceId}-text`,
						type: "symbol",
						source: props.sourceId,
						filter: filter(),
						layout: {
							"text-field": ["get", "subs"],
							"text-font": FONT_STACK,
							"text-overlap": "always",
							"text-size": [
								"interpolate",
								["linear"],
								["get", "subs"],
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
					beforeId={`${props.sourceId}-text-active`}
					layer={{
						id: `${props.sourceId}-circle-active`,
						type: "circle",
						source: props.sourceId,
						filter: filter(),
						paint: {
							"circle-opacity": [
								"case",
								["boolean", ["feature-state", "hover"], false],
								1,
								0,
							],
							"circle-color": COLORS["--color-primary-80"],
							"circle-radius": [
								"interpolate",
								["linear"],
								["get", "subs"],
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
					beforeId={BG_HEATMAP_LEVELS_LAYER}
					layer={{
						id: `${props.sourceId}-text-active`,
						type: "symbol",
						source: props.sourceId,
						filter: filter(),
						layout: {
							"text-field": ["get", "subs"],
							"text-font": FONT_STACK,
							"text-overlap": "always",
							"text-size": [
								"interpolate",
								["linear"],
								["get", "subs"],
								minSubmissions(),
								props.textMinSize,
								maxSubmissions(),
								props.textMaxSize,
							],
						},
						paint: {
							"text-opacity": [
								"case",
								["boolean", ["feature-state", "hover"], false],
								1,
								0,
							],
							"text-color": COLORS["--color-container"],
						},
					}}
				/>
			</GeoJSONSource>
		</>
	);
};
