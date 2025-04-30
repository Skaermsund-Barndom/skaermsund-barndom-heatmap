import { GeoJSONSource } from "@/components/geojson-source";
import { Layer } from "@/components/layer";
import {
	TooltipMarker,
	type TooltipMarkerStore,
} from "@/components/tooltip-marker";
import {
	BG_HEATMAP_LEVELS_LAYER,
	COLORS,
	FONT_STACK,
	type LEVELS,
} from "@/scripts/const";
import { type geojsonSource, interpolate } from "@/scripts/helpers";
import { setStore, store } from "@/scripts/store";
import type { MapProps } from "@/scripts/types";
import {
	type DataDrivenPropertyValueSpecification,
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
	size: {
		circleMin: number;
		circleMax: number;
		textMin: number;
		textMax: number;
	};
	levelId: (typeof LEVELS)[number]["id"];
	click?: () => void;
}

export const HeatmapLayer: VoidComponent<Props> = (props) => {
	// Active feature id (used to check if the active feature has changed with mousemove)
	const [activeFeatureId, setActiveFeatureId] = createSignal<number | string>();

	const filter = createMemo<FilterSpecification>(() => {
		return ["in", ["get", "id"], ["literal", store.filter]];
	});

	// Marker store
	const [marker, setMarker] = createStore<TooltipMarkerStore>({
		lngLat: undefined,
		offset: 0,
		name: "",
		grades: {},
	});

	// Get the minimum and maximum submissions for the features
	const minSubmissions = createMemo(() =>
		Math.min(0, ...props.source.data.features.map((f) => f.properties?.subs)),
	);
	const maxSubmissions = createMemo(() =>
		Math.max(1, ...props.source.data.features.map((f) => f.properties?.subs)),
	);

	// Size
	const size = (
		min: number,
		max: number,
	): DataDrivenPropertyValueSpecification<number> => [
		"interpolate",
		["linear"],
		["get", "subs"],
		minSubmissions(),
		min,
		maxSubmissions(),
		max,
	];

	// When the mouse moves over a feature, set the active feature id
	const mousemove = (event: MapLayerMouseEvent) => {
		const feature = event.features?.[0];
		if (feature?.geometry.type !== "Point") return;

		if (activeFeatureId() !== feature.id) {
			setActiveFeatureId(feature.id);
		}

		if (store.hoverId === Number(feature.id)) return;
		setStore({ hoverId: Number(feature.id) });
	};

	// When the hover id changes, update the marker and the feature state
	createEffect(() => {
		const hoverId = store.hoverId;
		if (!props.map.getSource(props.sourceId)) return;

		setMarker({ lngLat: undefined, offset: 0, name: "", grades: {} });

		for (const feature of props.source.data.features) {
			if (!feature.properties?.id) continue;

			const hover = feature.properties?.id === hoverId;
			props.map.setFeatureState(
				{
					id: feature.properties?.id,
					source: props.sourceId,
				},
				{
					hover,
				},
			);

			if (!hover) continue;

			const [lng, lat] =
				feature.geometry.type === "Point" ?
					feature.geometry.coordinates
				:	[0, 0];
			if (!lng || !lat) return;

			const { name, subs, grades } = feature.properties;
			const lngLat = new LngLat(lng, lat);
			const offset = interpolate(
				subs,
				minSubmissions(),
				props.size.circleMin,
				maxSubmissions(),
				props.size.circleMax,
			);

			setMarker({ lngLat, offset, name, grades });
		}
	});

	// When the mouse leaves a feature, reset the active feature id
	const mouseleave = () => {
		setStore({ hoverId: undefined });
	};

	const click = (event: MapLayerMouseEvent) => {
		const feature = event.features?.[0];
		if (feature?.geometry.type !== "Point") return;

		if (!props.click) return;
		props.click();

		const filter = JSON.parse(feature.properties?.filter);
		setStore({ hoverId: undefined, filter });
	};

	return (
		<>
			{/* Tooltip marker with name */}
			<TooltipMarker
				{...props}
				lngLat={marker.lngLat}
				offset={marker.offset}
				name={marker.name}
				grades={marker.grades}
			/>

			{/* Source */}
			<GeoJSONSource id={props.sourceId} map={props.map} source={props.source}>
				{/* Circle layer */}
				<Layer
					{...props}
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
							"circle-radius": size(props.size.circleMin, props.size.circleMax),
						},
					}}
				/>

				{/* Text layer */}
				<Layer
					{...props}
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
							"text-size": size(props.size.textMin, props.size.textMax),
						},
						paint: {
							"text-color": COLORS["--color-container"],
						},
					}}
				/>

				{/* Active circle (renders on top) */}
				<Layer
					{...props}
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
							"circle-radius": size(props.size.circleMin, props.size.circleMax),
						},
					}}
				/>

				{/* Active text (renders on top) */}
				<Layer
					{...props}
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
							"text-size": size(props.size.textMin, props.size.textMax),
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
