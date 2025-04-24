import { GeoJSONSource } from "@/components/maplibre/geojson-source";
import { Layer } from "@/components/maplibre/layer";
import { COLORS, FONT_STACK, ZOOM_LEVELS } from "@/scripts/const";
import { geojsonSource } from "@/scripts/helpers";
import type { HeatmapProps } from "@/scripts/types";
import type { VoidComponent } from "solid-js";

const SCHOOL_SOURCE = "schools";
const SCHOOL_CIRCLE_LAYER = "schools-circle";
const SCHOOL_TEXT_LAYER = "schools-text";
const ZOOMS = {
	minzoom: ZOOM_LEVELS.SCHOOL,
	maxzoom: ZOOM_LEVELS.MAX,
} as const;

interface Props extends HeatmapProps {}

export const SchoolLayers: VoidComponent<Props> = (props) => {
	return (
		<GeoJSONSource
			id={SCHOOL_SOURCE}
			map={props.map}
			source={geojsonSource(props.schools)}
		>
			<Layer
				map={props.map}
				layer={{
					...ZOOMS,
					id: SCHOOL_CIRCLE_LAYER,
					type: "circle",
					source: SCHOOL_SOURCE,
					paint: {
						"circle-color": COLORS["--color-primary-70"],
						"circle-radius": ["+", ["/", ["get", "submissions"], 5], 10],
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
						"text-size": 12,
					},
					paint: {
						"text-color": "#ffffff",
					},
				}}
			/>
		</GeoJSONSource>
	);
};
