import { Control } from "@/components/maplibre/control";
import type { MapProps } from "@/components/maplibre/map-gl";
import {
	type ControlPosition,
	NavigationControl as MaplibreNavigationControl,
	type NavigationControlOptions,
} from "maplibre-gl";
import type { VoidComponent } from "solid-js";

interface Props extends MapProps {
	options: NavigationControlOptions;
	position?: ControlPosition;
}

export const NavigationControl: VoidComponent<Props> = (props) => {
	return (
		<Control
			map={props.map}
			control={new MaplibreNavigationControl(props.options)}
			position={props.position}
		/>
	);
};
