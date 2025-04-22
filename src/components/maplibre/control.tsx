import type { MapProps } from "@/components/maplibre/map-gl";
import type { ControlPosition, IControl } from "maplibre-gl";
import { type ParentComponent, createEffect, onCleanup } from "solid-js";

interface Props extends MapProps {
	control?: IControl;
	position?: ControlPosition;
}

export const Control: ParentComponent<Props> = (props) => {
	createEffect(() => {
		const control = props.control;
		if (!control) return;

		props.map.addControl(control, props.position);

		onCleanup(() => {
			props.map.removeControl(control);
		});
	});

	return props.children;
};
