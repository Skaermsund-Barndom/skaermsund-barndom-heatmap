import { Layer } from "@/components/maplibre/layer";
import type { MapProps } from "@/components/maplibre/map-gl";
import { Background } from "@/components/solid/background";
import {
	BG_BORDERS_LAYER,
	BG_COUNTRY_LABEL_LAYER,
	BG_COUNTRY_LAYER,
	TOP_LAYER,
} from "@/scripts/const";
import type { VoidComponent } from "solid-js";

interface Props extends MapProps {}

export const LayerOrder: VoidComponent<Props> = (props) => {
	return (
		<div class="layers">
			<EmptyLayer id={TOP_LAYER} map={props.map} />
			<EmptyLayer id={BG_BORDERS_LAYER} beforeId={TOP_LAYER} map={props.map} />
			<EmptyLayer
				id={BG_COUNTRY_LAYER}
				beforeId={BG_COUNTRY_LABEL_LAYER}
				map={props.map}
			/>
			<Background map={props.map} />
		</div>
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
