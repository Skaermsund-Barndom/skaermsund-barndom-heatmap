import { LEVELS } from "@/scripts/const";
import { createStore } from "solid-js/store";

export const [store, setStore] = createStore({
	initialBounds: undefined as [number, number, number, number] | undefined,
	filter: [] as number[],
	levelId: LEVELS[0].id as (typeof LEVELS)[number]["id"],
	hoverId: undefined as number | undefined,
});
