import { Layer } from "@/components/maplibre/layer";
import { Background } from "@/components/solid/background";
import { HeatmapLayers } from "@/components/solid/heatmap-layers";
import { MunicipalityMap } from "@/components/solid/municipality-map";
import {
	BG_HEATMAP_LEVELS_LAYER,
	BG_MUNICIPALITIES_LAYER,
	BOTTOM_LAYER,
	TOP_LAYER,
} from "@/scripts/const";
import type { MapProps } from "@/scripts/types";
import type { VoidComponent } from "solid-js";

interface Props extends MapProps {}

export const LayerOrder: VoidComponent<Props> = (props) => {
	return (
		<>
			<Background {...props} />
			<MunicipalityMap {...props} />
			<HeatmapLayers {...props} />

			<EmptyLayer
				{...props}
				id={BOTTOM_LAYER}
				beforeId={BG_MUNICIPALITIES_LAYER}
			/>
			<EmptyLayer
				{...props}
				id={BG_MUNICIPALITIES_LAYER}
				beforeId={BG_HEATMAP_LEVELS_LAYER}
			/>
			<EmptyLayer
				{...props}
				id={BG_HEATMAP_LEVELS_LAYER}
				beforeId={TOP_LAYER}
			/>
			<EmptyLayer {...props} id={TOP_LAYER} />
		</>
	);
};

interface EmptyLayerProps extends MapProps {
	id: string;
	beforeId?: string;
}

function EmptyLayer(props: EmptyLayerProps) {
	return (
		<Layer
			{...props}
			layer={{
				id: props.id,
				type: "background",
				layout: {
					visibility: "none",
				},
			}}
			beforeId={props.beforeId}
		/>
	);
}
