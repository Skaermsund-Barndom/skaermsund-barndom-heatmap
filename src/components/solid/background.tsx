import { Layer } from "@/components/maplibre/layer";
import { BG_LAYER, BOTTOM_LAYER, COLORS } from "@/scripts/const";
import type { MapProps } from "@/scripts/types";
import type { VoidComponent } from "solid-js";

interface Props extends MapProps {}

export const Background: VoidComponent<Props> = (props) => {
	return (
		<Layer
			{...props}
			beforeId={BOTTOM_LAYER}
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
