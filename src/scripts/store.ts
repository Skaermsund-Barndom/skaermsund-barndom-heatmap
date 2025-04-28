import type {
	municipalityCollection,
	regionCollection,
	schoolCollection,
} from "@/scripts/collections";
import { LEVELS } from "@/scripts/const";
import type { MunicipalityMapProperties } from "@/scripts/types";
import type { FeatureCollection, MultiPolygon, Polygon } from "geojson";
import { createStore } from "solid-js/store";

export const [store, setStore] = createStore({
	filter: [] as number[],
	levelId: LEVELS[0].id as (typeof LEVELS)[number]["id"],
	hoverId: undefined as number | undefined,

	schoolCollection: undefined as Awaited<ReturnType<typeof schoolCollection>>,
	regionCollection: undefined as Awaited<ReturnType<typeof regionCollection>>,
	municipalityCollection: undefined as Awaited<
		ReturnType<typeof municipalityCollection>
	>,

	municipalitiesMap: undefined as
		| FeatureCollection<Polygon | MultiPolygon, MunicipalityMapProperties>
		| undefined,
});
