import { Layer } from "@/components/maplibre/layer";
import { BG_LAYER, COLORS } from "@/scripts/const";
import type { MapProps } from "@/scripts/types";
import type { VoidComponent } from "solid-js";

interface Props extends MapProps {
	beforeId?: string;
}

export const Background: VoidComponent<Props> = (props) => {
	return (
		<Layer
			map={props.map}
			beforeId={props.beforeId}
			layer={{
				id: BG_LAYER,
				type: "background",
				paint: {
					"background-color": COLORS["--color-secondary"],
				},
			}}
		/>
	);
};
