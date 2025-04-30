import { Marker } from "@/components/marker";
import type { Grades, MapProps } from "@/scripts/types";
import type { LngLat } from "maplibre-gl";
import type { VoidComponent } from "solid-js";
import { For, Show, createMemo } from "solid-js";

export interface TooltipMarkerStore {
	lngLat?: LngLat;
	offset?: number;
	name?: string;
	grades?: Grades;
	subs: number;
}

interface Props extends MapProps, TooltipMarkerStore {}

export const TooltipMarker: VoidComponent<Props> = (props) => {
	const grades = createMemo(() =>
		Object.entries(props.grades ?? {}).sort(
			([a], [b]) => Number(a.charAt(0)) - Number(b.charAt(0)),
		),
	);

	return (
		<Marker {...props} lngLat={props.lngLat} class="pointer-events-none">
			<div
				class="bg-primary-80 data-[no-subs=true]:bg-disabled group text-container data-[no-subs=true]:text-text relative max-w-64 rounded-xl px-3 py-2 text-sm"
				data-no-subs={props.subs === 0}
				style={{
					transform: `translateY(calc(-${props.offset}px - 50% - 0.5rem))`,
				}}
			>
				<span
					class="bg-primary-80 group-data-[no-subs=true]:bg-disabled absolute bottom-[1px] left-[50%] h-2 w-4 translate-x-[-50%] translate-y-full"
					style={{
						"clip-path": "polygon(0% 0%, 100% 0%, 50% 100%)",
					}}
				/>
				<span>{props.name}</span>
				<Show when={grades().length > 0}>
					<div class="border-container/20 mt-2 flex flex-col gap-0 border-t pt-2 font-light">
						<For each={grades()}>
							{([grade, subs]) => (
								<span>
									{grade}: {subs}
								</span>
							)}
						</For>
					</div>
				</Show>
			</div>
		</Marker>
	);
};
