import { createStore } from "solid-js/store";

export const [store, setStore] = createStore({
	activeSchoolName: undefined as string | undefined,
	hoverSchoolName: undefined as string | undefined,
	activeMunicipalityName: undefined as string | undefined,
	hoverMunicipalityName: undefined as string | undefined,
	activeRegionName: undefined as string | undefined,
	hoverRegionName: undefined as string | undefined,
});
