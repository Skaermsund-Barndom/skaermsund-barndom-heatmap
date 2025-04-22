import type { MapProps } from "@/components/maplibre/map-gl";
import type { AddLayerObject, MapLayerEventType } from "maplibre-gl";
import { type VoidComponent, createEffect, onCleanup } from "solid-js";

type LayerEvents = {
	[K in keyof MapLayerEventType]?: (event: MapLayerEventType[K]) => void;
};

interface Props extends MapProps {
	layer: AddLayerObject;
	beforeId?: string;
	events?: LayerEvents;
}

export const Layer: VoidComponent<Props> = (props) => {
	createEffect(() => {
		if (!props.events) return;

		const entries = Object.entries(props.events) as [
			keyof MapLayerEventType,
			(event: MapLayerEventType[keyof MapLayerEventType]) => void,
		][];

		for (const [event, listener] of entries) {
			props.map.on(event, props.layer.id, listener);
		}

		onCleanup(() => {
			for (const [event, listener] of entries) {
				props.map.off(event, props.layer.id, listener);
			}
		});
	});

	createEffect(() => {
		console.log(props.layer.id);

		props.map.addLayer(
			props.layer,
			props.map.getLayer(props.beforeId ?? "") ? props.beforeId : undefined,
		);

		onCleanup(() => {
			if (props.map.getLayer(props.layer.id)) {
				props.map.removeLayer(props.layer.id);
			}
		});
	});

	return null;
};
