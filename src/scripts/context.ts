import type { AppProps } from "@/components/app";
import type { Map as MapGL } from "maplibre-gl";
import { createContext } from "solid-js";

export const AppContext = createContext<AppProps>();

export const MapContext = createContext<MapGL>();
