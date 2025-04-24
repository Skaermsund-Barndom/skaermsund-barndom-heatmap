import { GeoJSONSource } from "@/components/maplibre/geojson-source";
import { Layer } from "@/components/maplibre/layer";
import { COLORS, FONT_STACK } from "@/scripts/const";
import { geojsonSource } from "@/scripts/helpers";
import type { HeatmapProps } from "@/scripts/types";
import type { VoidComponent } from "solid-js";
import { createMemo } from "solid-js";

const REGION_SOURCE = "regions";
const REGION_CIRCLE_LAYER = "regions-circle";
const REGION_TEXT_LAYER = "regions-text";

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
					id: REGION_CIRCLE_LAYER,
					type: "fill",
					source: REGION_SOURCE,
					paint: {
						"fill-color": COLORS["--color-primary"],
						"fill-opacity": 0.5,
					},
				}}
			/>
			<Layer
				map={props.map}
				layer={{
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
