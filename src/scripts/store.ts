import { createStore } from "solid-js/store";

export const [store, setStore] = createStore({
	activeSchoolName: undefined as string | undefined,
	activeMunicipalityName: undefined as string | undefined,
	activeRegionName: undefined as string | undefined,
});
