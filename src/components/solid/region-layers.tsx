import { GeoJSONSource } from "@/components/maplibre/geojson-source";
import { Layer } from "@/components/maplibre/layer";
import { COLORS, FONT_STACK, ZOOM_LEVELS } from "@/scripts/const";
import { geojsonSource } from "@/scripts/helpers";
import type { HeatmapProps } from "@/scripts/types";
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

export const RegionLayers: VoidComponent<Props> = (props) => {
	const regions = createMemo(() => {
		return props.schools;
	});

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
						"circle-color": COLORS["--color-primary-30"],
						"circle-radius": ["+", ["/", ["get", "submissions"], 5], 10],
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
