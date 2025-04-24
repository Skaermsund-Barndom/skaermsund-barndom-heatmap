import type { MapProps } from "@/scripts/types";
import {
	type LngLatLike,
	Popup as MapPopup,
	type PopupOptions,
} from "maplibre-gl";
import type { VoidComponent } from "solid-js";
import { createEffect, createSignal, onCleanup } from "solid-js";

type PopupEvents = {
	[key: string]: (event: {
		type: "dragstart" | "drag" | "dragend";
		target: MapPopup;
	}) => void;
};

interface Props extends MapProps {
	options: PopupOptions;
	events?: PopupEvents;
	lngLat?: LngLatLike;
}

export const Popup: VoidComponent<Props> = (props) => {
	const [popup, setPopup] = createSignal<MapPopup>();

	createEffect(() => {
		if (!props.events) return;

		const entries = Object.entries(props.events) as [
			string,
			(event: unknown) => void,
		][];

		for (const [event, listener] of entries) {
			popup()?.on(event, listener);
		}

		onCleanup(() => {
			for (const [event, listener] of entries) {
				popup()?.off(event, listener);
			}
		});
	});

	createEffect(() => {
		const popup = new MapPopup(props.options);

		setPopup(popup);

		onCleanup(() => {
			popup.remove();
		});
	});

	createEffect(() => {
		if (!props.lngLat) return;

		popup()?.setLngLat(props.lngLat);
		popup()?.addTo(props.map);
	});

	return null;
};
