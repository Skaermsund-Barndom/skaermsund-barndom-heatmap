import { Marker } from "@/components/maplibre/marker";
import type { MapProps } from "@/scripts/types";
import type { LngLat } from "maplibre-gl";
import type { VoidComponent } from "solid-js";

export interface TooltipMarkerStore {
	lngLat?: LngLat;
	offset?: number;
	name?: string;
}

interface Props extends MapProps, TooltipMarkerStore {}

export const TooltipMarker: VoidComponent<Props> = (props) => {
	return (
		<Marker map={props.map} lngLat={props.lngLat} class="pointer-events-none">
			<div
				class="bg-primary-80 text-container relative rounded-xl px-3 py-2 text-sm"
				style={{
					transform: `translateY(calc(-${props.offset}px - 50% - 0.5rem))`,
				}}
			>
				<span
					class="bg-primary-80 absolute bottom-[1px] left-[50%] h-2 w-4 translate-x-[-50%] translate-y-full"
					style={{
						"clip-path": "polygon(0% 0%, 100% 0%, 50% 100%)",
					}}
				/>
				<span>{props.name}</span>
			</div>
		</Marker>
	);
};
