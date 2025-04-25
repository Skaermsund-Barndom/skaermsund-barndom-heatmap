import { Layer } from "@/components/maplibre/layer";
import { Background } from "@/components/solid/background";
import { HeatmapLayers } from "@/components/solid/heatmap-layers";
import { MunicipalityMap } from "@/components/solid/municipality-map";
import {
	BG_GRADE_LEVELS_LAYER,
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
			<Background map={props.map} beforeId={BOTTOM_LAYER} />
			<MunicipalityMap map={props.map} beforeId={BG_MUNICIPALITIES_LAYER} />
			<HeatmapLayers map={props.map} />

			<EmptyLayer
				id={BOTTOM_LAYER}
				beforeId={BG_MUNICIPALITIES_LAYER}
				map={props.map}
			/>
			<EmptyLayer
				id={BG_MUNICIPALITIES_LAYER}
				beforeId={BG_GRADE_LEVELS_LAYER}
				map={props.map}
			/>
			<EmptyLayer
				id={BG_GRADE_LEVELS_LAYER}
				beforeId={TOP_LAYER}
				map={props.map}
			/>
			<EmptyLayer id={TOP_LAYER} map={props.map} />
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
			map={props.map}
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
