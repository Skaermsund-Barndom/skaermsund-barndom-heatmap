import { Layer } from "@/components/maplibre/layer";
import type { MapProps } from "@/components/maplibre/map-gl";
import { BG_COUNTRY_LAYER, BG_LAYER, COLORS } from "@/scripts/const";
import type { VoidComponent } from "solid-js";

interface Props extends MapProps {}

export const Background: VoidComponent<Props> = (props) => {
	return (
		<Layer
			map={props.map}
			beforeId={BG_COUNTRY_LAYER}
			layer={{
				id: BG_LAYER,
				type: "background",
				paint: {
					"background-color": COLORS["--color-container"],
					"background-opacity": 0,
				},
			}}
		/>
	);
};
