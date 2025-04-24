import { GeoJSONSource } from "@/components/maplibre/geojson-source";
import { Layer } from "@/components/maplibre/layer";
import { TooltipMarker } from "@/components/solid/tooltip-marker";
import { COLORS, FONT_STACK, ZOOM_LEVELS } from "@/scripts/const";
import { geojsonSource, interpolate } from "@/scripts/helpers";
import type { HeatmapProps } from "@/scripts/types";
import { centerMedian, featureCollection, multiPoint, point } from "@turf/turf";
import type { MultiPoint } from "geojson";
import { LngLat, type MapLayerMouseEvent } from "maplibre-gl";
import { type VoidComponent, createMemo, createSignal } from "solid-js";

const MUNICIPALITY_SOURCE = "municipalities";
const MUNICIPALITY_CIRCLE_LAYER = "municipalities-circle";
const MUNICIPALITY_TEXT_LAYER = "municipalities-text";
const ZOOMS = {
	minzoom: ZOOM_LEVELS.MUNICIPALITY,
	maxzoom: ZOOM_LEVELS.SCHOOL,
} as const;
const MUNICIPALITY_CIRCLE_MIN_RADIUS = 20;
const MUNICIPALITY_CIRCLE_MAX_RADIUS = 60;
const MUNICIPALITY_TEXT_MIN_SIZE = 14;
const MUNICIPALITY_TEXT_MAX_SIZE = 20;

interface Props extends HeatmapProps {}

interface MunicipalityProperties {
	submissions: number;
	municipality_name: string;
}

export const MunicipalityLayers: VoidComponent<Props> = (props) => {
	const [markerLngLat, setMarkerLngLat] = createSignal<LngLat>();
	const [markerOffset, setMarkerOffset] = createSignal(0);
	const [markerText, setMarkerText] = createSignal("");

	const municipalities = createMemo(() => {
		const municipalityCollection = props.schools.features.reduce(
			(collection, feature) => {
				const {
					geometry: { coordinates },
					properties: { municipality_name, submissions },
				} = feature;

				const index = collection.features.findIndex(
					(feature) =>
						feature.properties.municipality_name === municipality_name,
				);
				if (index === -1) {
					const feature = multiPoint([coordinates], {
						municipality_name,
						submissions,
					});
					collection.features.push(feature);

					return collection;
				}

				if (collection.features[index]) {
					collection.features[index].properties = {
						submissions:
							collection.features[index].properties.submissions + submissions,
						municipality_name,
					};
					collection.features[index].geometry.coordinates.push(coordinates);
				}

				return collection;
			},
			featureCollection<MultiPoint, MunicipalityProperties>([]),
		);

		return featureCollection(
			municipalityCollection.features.map((feature) => {
				const { geometry, properties } = feature;

				const collection = featureCollection(
					geometry.coordinates.map((c) => point(c)),
				);
				const centroid = centerMedian(collection);
				return point(centroid.geometry.coordinates, properties);
			}),
		);
	});

	const municipalityMin = createMemo(() => {
		return Math.min(
			...municipalities().features.map((f) => f.properties.submissions),
		);
	});

	const municipalityMax = createMemo(() => {
		return Math.max(
			...municipalities().features.map((f) => f.properties.submissions),
		);
	});

	const mouseenter = (event: MapLayerMouseEvent) => {
		const feature = event.features?.[0];
		if (feature?.geometry.type !== "Point") return;

		const [lng, lat] = feature.geometry.coordinates;
		if (!lng || !lat) return;

		const lngLat = new LngLat(lng, lat);
		setMarkerLngLat(lngLat);

		const offset = interpolate(
			feature.properties.submissions,
			municipalityMin(),
			municipalityMax(),
			MUNICIPALITY_CIRCLE_MIN_RADIUS,
			MUNICIPALITY_CIRCLE_MAX_RADIUS,
		);
		setMarkerOffset(offset);
		setMarkerText(feature.properties.municipality_name);

		props.map.setFeatureState(
			{
				id: feature.id,
				source: MUNICIPALITY_SOURCE,
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

		const features = props.map.querySourceFeatures(MUNICIPALITY_SOURCE);
		for (const feature of features) {
			props.map.setFeatureState(
				{
					id: feature.id,
					source: MUNICIPALITY_SOURCE,
				},
				{
					hover: false,
				},
			);
		}
	};

	return (
		<GeoJSONSource
			id={MUNICIPALITY_SOURCE}
			map={props.map}
			source={geojsonSource(municipalities())}
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
					mouseenter,
					mouseleave,
				}}
				layer={{
					...ZOOMS,
					id: MUNICIPALITY_CIRCLE_LAYER,
					type: "circle",
					source: MUNICIPALITY_SOURCE,
					paint: {
						"circle-color": [
							"case",
							["boolean", ["feature-state", "hover"], false],
							COLORS["--color-primary-70"],
							COLORS["--color-primary"],
						],
						"circle-radius": [
							"interpolate",
							["linear"],
							["get", "submissions"],
							municipalityMin(),
							MUNICIPALITY_CIRCLE_MIN_RADIUS,
							municipalityMax(),
							MUNICIPALITY_CIRCLE_MAX_RADIUS,
						],
					},
				}}
			/>
			<Layer
				map={props.map}
				layer={{
					...ZOOMS,
					id: MUNICIPALITY_TEXT_LAYER,
					type: "symbol",
					source: MUNICIPALITY_SOURCE,
					layout: {
						"text-field": ["get", "submissions"],
						"text-font": FONT_STACK,
						"text-overlap": "always",
						"text-size": [
							"interpolate",
							["linear"],
							["get", "submissions"],
							municipalityMin(),
							MUNICIPALITY_TEXT_MIN_SIZE,
							municipalityMax(),
							MUNICIPALITY_TEXT_MAX_SIZE,
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
