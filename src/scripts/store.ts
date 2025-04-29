import { LEVELS } from "@/scripts/const";
import { createStore } from "solid-js/store";
import type { SchoolCollection } from "./types";

export const [store, setStore] = createStore({
	initialBounds: undefined as [number, number, number, number] | undefined,
	filter: [] as number[],
	levelId: LEVELS[0].id as (typeof LEVELS)[number]["id"],
	hoverId: undefined as number | undefined,

	allSubs: (collection?: SchoolCollection) =>
		collection?.features.reduce((acc, f) => acc + f.properties.subs, 0) ?? 0,
	allRegions: (collection?: SchoolCollection) =>
		Array.from(
			collection?.features.reduce<Set<number>>(
				(set, f) => set.add(f.properties.r_id),
				new Set(),
			) ?? [],
		),
	allMunicipalities: (collection?: SchoolCollection) =>
		Array.from(
			collection?.features.reduce<Set<number>>(
				(set, f) => set.add(f.properties.m_id),
				new Set(),
			) ?? [],
		),
	allSchools: (collection?: SchoolCollection) =>
		Array.from(
			collection?.features.reduce<Set<number>>(
				(set, f) => set.add(f.properties.id),
				new Set(),
			) ?? [],
		),
});
