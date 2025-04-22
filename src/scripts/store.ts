import { INITIAL_ZOOM, MAX_ZOOM, MIN_ZOOM } from "@/scripts/const";
import type { Map as MapGL } from "maplibre-gl";
import { createStore } from "solid-js/store";

export const [store, setStore] = createStore({
	map: undefined as MapGL | undefined,
	maxZoom: MAX_ZOOM,
	minZoom: MIN_ZOOM,
	zoom: INITIAL_ZOOM,
});
