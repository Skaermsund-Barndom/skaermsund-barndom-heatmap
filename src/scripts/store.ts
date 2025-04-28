import {
	municipalitiesCollection,
	regionsCollection,
	schoolsCollection,
} from "@/scripts/collections";
import type { schools } from "@/scripts/schools";
import type { MunicipalityMapProperties } from "@/scripts/types";
import type { FeatureCollection, MultiPolygon, Polygon } from "geojson";
import { createStore } from "solid-js/store";

export const [store, setStore] = createStore({
	filter: [] as number[],
	level: 0 as 0 | 1 | 2,
	municipalitiesMap: undefined as
		| FeatureCollection<Polygon | MultiPolygon, MunicipalityMapProperties>
		| undefined,
	schools: undefined as Awaited<ReturnType<typeof schools>>,
	schoolsCollection,
	regionsCollection,
	municipalitiesCollection,
	hoverId: undefined as number | undefined,
});
