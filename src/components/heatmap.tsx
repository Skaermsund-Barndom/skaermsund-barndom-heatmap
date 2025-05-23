import type { AppProps } from "@/components/app";
import { LoadedMap } from "@/components/loaded-map";
import { MapGL } from "@/components/map-gl";
import { remToPx } from "@/scripts/helpers";
import type { Map as MapGLType } from "maplibre-gl";
import { Show, type VoidComponent, createEffect, createSignal } from "solid-js";

interface Props extends AppProps {}

export const Heatmap: VoidComponent<Props> = (props) => {
	const [map, setMap] = createSignal<MapGLType>();

	createEffect(() => {
		map()?.touchZoomRotate.disableRotation();
		map()?.keyboard.disableRotation();

		if (props.initialBounds?.length === 4) {
			map()?.zoomTo(0);
			map()?.fitBounds(props.initialBounds, {
				duration: 800,
				padding: remToPx(2),
			});
		}
	});

	return (
		<div class="bg-secondary h-full w-full overflow-hidden rounded-[1.25rem]">
			<MapGL
				mapOptions={{
					style: {
						version: 8,
						sources: {},
						layers: [],
						glyphs: `${window.location.origin}/fonts/{fontstack}/{range}.pbf`,
						transition: {
							duration: 0,
							delay: 0,
						},
					},
					dragRotate: false,
					hash: false,
					attributionControl: false,
					fadeDuration: 0,
					touchPitch: false,
					boxZoom: false,
					maxBounds: [
						[8.052716042949726 - 10, 54.54105080166195 - 5],
						[15.210410477270017 + 10, 57.770218411476634 + 5],
					],
				}}
				events={{
					load: (event) => setMap(event.target),
				}}
			>
				<Show when={map()}>
					{(map) => <LoadedMap {...props} map={map()} />}
				</Show>
			</MapGL>
		</div>
	);
};
