import { createStore } from "solid-js/store";

export const [store, setStore] = createStore({
	activeSchoolId: undefined as number | undefined,
	hoverSchoolId: undefined as number | undefined,
	activeMunicipalityId: undefined as number | undefined,
	hoverMunicipalityId: undefined as number | undefined,
	activeRegionId: undefined as number | undefined,
	hoverRegionId: undefined as number | undefined,
});
