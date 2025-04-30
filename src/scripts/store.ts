import { LEVELS } from "@/scripts/const";
import type {
	MunicipalityCollection,
	RegionCollection,
	SchoolCollection,
} from "@/scripts/types";
import { createStore } from "solid-js/store";

export const [store, setStore] = createStore({
	initialBounds: undefined as [number, number, number, number] | undefined,
	filter: [] as number[],
	levelId: LEVELS[0].id as (typeof LEVELS)[number]["id"],
	hoverId: undefined as number | undefined,

	allSubs: (collection?: SchoolCollection) =>
		collection?.features.reduce((acc, f) => acc + f.properties.subs, 0) ?? 0,
	allIds: (
		collection?: RegionCollection | MunicipalityCollection | SchoolCollection,
	) => collection?.features.map((f) => f.properties.id) ?? [],
});
