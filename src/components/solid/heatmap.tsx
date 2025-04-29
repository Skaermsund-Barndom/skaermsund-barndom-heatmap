import { AttributionControl } from "@/components/maplibre/attribution-control";
import { MapGL } from "@/components/maplibre/map-gl";
import { BackControls } from "@/components/solid/back-controls";
import { LayerOrder } from "@/components/solid/layer-order";
import { ZoomControls } from "@/components/solid/zoom-controls";
import { INITIAL_ZOOM } from "@/scripts/const";
import { remToPx } from "@/scripts/helpers";
import { setStore, store } from "@/scripts/store";
import type { Map as MapGLType } from "maplibre-gl";
import {
	Show,
	type VoidComponent,
	createEffect,
	createSignal,
	onCleanup,
} from "solid-js";

export const Heatmap: VoidComponent = () => {
	const [map, setMap] = createSignal<MapGLType>();

	createEffect(() => {
		map()?.touchZoomRotate.disableRotation();
		map()?.keyboard.disableRotation();

		map()?.on("zoom", handleZoom);

		if (store.initialBounds?.length === 4) {
			map()?.fitBounds(store.initialBounds, {
				duration: 0,
				padding: remToPx(1),
			});
		}

		onCleanup(() => {
			map()?.off("zoom", handleZoom);
		});
	});

	const handleZoom = () => {
		setStore({ hoverId: undefined });
	};

	return (
		<div class="h-full w-full overflow-hidden rounded-[1.25rem]">
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
					// style: "https://demotiles.maplibre.org/style.json",
					zoom: INITIAL_ZOOM,
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
					{(map) => (
						<>
							<LayerOrder map={map()} />
							<AttributionControl
								options={{
									customAttribution: `<a href="https://maplibre.org/" target="_blank" rel="noopener noreferrer" class="bg-primary-80/50 rounded-full px-2 py-1 m-1.5 text-container flex">© MapLibre</a>`,
									compact: false,
								}}
								position="bottom-left"
								map={map()}
							/>
							<ZoomControls map={map()} />
							<BackControls map={map()} />
						</>
					)}
				</Show>
			</MapGL>
		</div>
	);
};
