import { Control } from "@/components/maplibre/control";
import type { MapProps } from "@/scripts/types";
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
			{...props}
			control={new MaplibreAttributionControl(props.options)}
			position={props.position}
		/>
	);
};
