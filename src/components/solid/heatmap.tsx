import { AttributionControl } from "@/components/maplibre/attribution-control";
import { MapGL } from "@/components/maplibre/map-gl";
import { LayerOrder } from "@/components/solid/layer-order";
import { ZoomControls } from "@/components/solid/zoom-controls";
import { INITIAL_ZOOM } from "@/scripts/const";
import type { Map as MapGLType } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Show, type VoidComponent, createEffect, createSignal } from "solid-js";

export const Heatmap: VoidComponent = () => {
	const [map, setMap] = createSignal<MapGLType>();

	createEffect(() => {
		map()?.touchZoomRotate.disableRotation();
		map()?.keyboard.disableRotation();
	});

	return (
		<>
			<MapGL
				mapOptions={{
					// style: {
					// 	version: 8,
					// 	sources: {},
					// 	layers: [],
					// 	glyphs: `${window.location.origin}/fonts/{fontstack}/{range}.pbf`,
					// 	transition: {
					// 		duration: 0,
					// 		delay: 0,
					// 	},
					// },
					style: "https://demotiles.maplibre.org/style.json",
					zoom: INITIAL_ZOOM,
					dragRotate: false,
					hash: false,
					attributionControl: false,
					fadeDuration: 0,
					touchPitch: false,
					boxZoom: false,
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
									customAttribution: `<a href="https://maplibre.org/" target="_blank" rel="noopener noreferrer">MapLibre</a>`,
									compact: false,
								}}
								position="bottom-left"
								map={map()}
							/>
							<ZoomControls map={map()} />
						</>
					)}
				</Show>
			</MapGL>
		</>
	);
};
