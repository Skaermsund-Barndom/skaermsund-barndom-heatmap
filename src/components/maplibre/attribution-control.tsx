import { Control } from "@/components/maplibre/control";
import type { MapProps } from "@/components/maplibre/map-gl";
import {
	type AttributionControlOptions,
	type ControlPosition,
	AttributionControl as MaplibreAttributionControl,
} from "maplibre-gl";
import type { VoidComponent } from "solid-js";

interface Props extends MapProps {
	options: AttributionControlOptions;
	position?: ControlPosition;
}

export const AttributionControl: VoidComponent<Props> = (props) => {
	return (
		<Control
			map={props.map}
			control={new MaplibreAttributionControl(props.options)}
			position={props.position}
		/>
	);
};
