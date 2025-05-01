import { LEVELS } from "@/scripts/const";
import type { Level } from "@/scripts/types";
import { createStore } from "solid-js/store";

export const [store, setStore] = createStore({
	/**
	 * The initial bounds of the map.
	 */
	initialBounds: undefined as [number, number, number, number] | undefined,

	/**
	 * Filter when clicking on a region/municipality.
	 */
	filter: new Set<number>(),

	/**
	 * The level id of the map.
	 */
	level: LEVELS[0] as Level,

	/**
	 * When hovering over a region/municipality/school.
	 */
	hoverId: undefined as number | undefined,

	/**
	 * A set of the ids of all regions.
	 */
	allRegionsIds: new Set<number>(),

	/**
	 * A set of the ids of all municipalities.
	 */
	allMunicipalitiesIds: new Set<number>(),

	/**
	 * A set of the ids of all schools.
	 */
	allSchoolsIds: new Set<number>(),

	/**
	 * The total number of submissions across all schools.
	 */
	allSubs: 0,
});
