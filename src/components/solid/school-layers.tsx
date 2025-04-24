import { Layer } from "@/components/maplibre/layer";
import type { MapProps } from "@/components/maplibre/map-gl";
import { COLORS, FONT_STACK } from "@/scripts/const";
import type { VoidComponent } from "solid-js";

interface Props extends MapProps {}

export const SchoolLayers: VoidComponent<Props> = (props) => {
	return (
		<>
			<Layer
				map={props.map}
				layer={{
					id: "grade-levels",
					type: "circle",
					source: "grade-levels",
					paint: {
						"circle-color": COLORS["--color-primary"],
						"circle-radius": ["+", ["/", ["get", "submissions"], 5], 10],
					},
				}}
			/>
			<Layer
				map={props.map}
				layer={{
					id: "regions",
					type: "symbol",
					source: "grade-levels",
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
		</>
	);
};
