import { AccordionList } from "@/components/solid/accordion-list";
import { AppContext } from "@/scripts/app-context";
import { UiContext } from "@/scripts/ui-context";
import { type VoidComponent, createMemo, useContext } from "solid-js";
import { createStore } from "solid-js/store";

export interface UiStore {
	activeRegion: string;
	activeMunicipality: string;
	activeSchool: string;
}

export const Ui: VoidComponent = () => {
	const appStore = useContext(AppContext);

	const [uiStore, setUiStore] = createStore<UiStore>({
		activeRegion: "",
		activeMunicipality: "",
		activeSchool: "",
	});

	const regions = createMemo(() => {
		const reducedRegions =
			appStore?.schools?.features.reduce((acc, school) => {
				const region = school.properties.region_name;
				if (!acc.includes(region)) {
					acc.push(region);
				}
				return acc;
			}, [] as string[]) ?? [];

		return reducedRegions;
	});

	const municipalities = createMemo(() => {
		const reducedMunicipalities =
			appStore?.schools?.features.reduce((acc, school) => {
				const municipality = school.properties.municipality_name;
				if (
					!acc.includes(municipality)
					&& uiStore.activeRegion === school.properties.region_name
				) {
					acc.push(municipality);
				}
				return acc;
			}, [] as string[]) ?? [];
		return reducedMunicipalities;
	});

	const schools = createMemo(() => {
		const reducedSchools =
			appStore?.schools?.features.reduce((acc, school) => {
				const schoolName = school.properties.school_name;
				if (
					!acc.includes(schoolName)
					&& uiStore.activeMunicipality === school.properties.municipality_name
				) {
					acc.push(schoolName);
				}
				return acc;
			}, [] as string[]) ?? [];
		return reducedSchools;
	});

	return (
		<div class="hidden h-fit max-h-full w-full grid-cols-1 items-start gap-6 overflow-hidden p-6 md:grid">
			<UiContext.Provider value={[uiStore, setUiStore]}>
				<AccordionList
					items={regions()}
					storeKey="activeRegion"
					title="Region"
					placeholder="Vælg region"
				/>
				<AccordionList
					items={municipalities()}
					storeKey="activeMunicipality"
					title="Municipalities"
					placeholder="Vælg kommune"
					disabled={!uiStore.activeRegion}
				/>
				<AccordionList
					items={schools()}
					storeKey="activeSchool"
					title="Schools"
					placeholder="Vælg skole"
					disabled={!uiStore.activeMunicipality}
				/>
			</UiContext.Provider>
		</div>
	);
};
