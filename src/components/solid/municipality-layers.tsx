import { GeoJSONSource } from "@/components/maplibre/geojson-source";
import { Layer } from "@/components/maplibre/layer";
import { COLORS, FONT_STACK } from "@/scripts/const";
import { geojsonSource } from "@/scripts/helpers";
import type { HeatmapProps } from "@/scripts/types";
import { type VoidComponent, createMemo } from "solid-js";

const MUNICIPALITY_SOURCE = "municipalities";
const MUNICIPALITY_CIRCLE_LAYER = "municipalities-circle";
const MUNICIPALITY_TEXT_LAYER = "municipalities-text";

interface Props extends HeatmapProps {}

export const MunicipalityLayers: VoidComponent<Props> = (props) => {
	const municipalities = createMemo(() => {
		return props.schools;
	});

	return (
		<GeoJSONSource
			id={MUNICIPALITY_SOURCE}
			map={props.map}
			source={geojsonSource(municipalities())}
		>
			<Layer
				map={props.map}
				layer={{
					id: MUNICIPALITY_CIRCLE_LAYER,
					type: "circle",
					source: MUNICIPALITY_SOURCE,
					paint: {
						"circle-color": COLORS["--color-primary"],
						"circle-radius": ["+", ["/", ["get", "submissions"], 5], 10],
					},
				}}
			/>
			<Layer
				map={props.map}
				layer={{
					id: MUNICIPALITY_TEXT_LAYER,
					type: "symbol",
					source: MUNICIPALITY_SOURCE,
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
