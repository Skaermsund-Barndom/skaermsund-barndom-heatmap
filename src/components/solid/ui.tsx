import { AccordionList } from "@/components/solid/accordion-list";
import { AppContext } from "@/scripts/app-context";
import { store } from "@/scripts/store";
import {
	type VoidComponent,
	createEffect,
	createMemo,
	createSignal,
	useContext,
} from "solid-js";

export const Ui: VoidComponent = () => {
	const appStore = useContext(AppContext);

	const [regionsOpen, setRegionsOpen] = createSignal(true);
	const [municipalitiesOpen, setMunicipalitiesOpen] = createSignal(false);
	const [schoolsOpen, setSchoolsOpen] = createSignal(false);

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
					&& store.activeRegionName === school.properties.region_name
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
					&& store.activeMunicipalityName
						=== school.properties.municipality_name
				) {
					acc.push(schoolName);
				}
				return acc;
			}, [] as string[]) ?? [];
		return reducedSchools;
	});

	const municipalitiesDisabled = createMemo(
		() => !regions().find((r) => r === store.activeRegionName),
	);

	const schoolsDisabled = createMemo(
		() => !municipalities().find((m) => m === store.activeMunicipalityName),
	);

	createEffect(() => {
		if (!regionsOpen() && !municipalitiesDisabled()) {
			setMunicipalitiesOpen(true);
		} else {
			setMunicipalitiesOpen(false);
		}
	});

	createEffect(() => {
		if (!regionsOpen() && !municipalitiesOpen() && !schoolsDisabled()) {
			setSchoolsOpen(true);
		} else {
			setSchoolsOpen(false);
		}
	});

	return (
		<div class="hidden h-fit max-h-full w-full grid-cols-1 items-start gap-6 overflow-hidden p-6 md:grid">
			<AccordionList
				items={regions()}
				storeActiveKey="activeRegionName"
				storeHoverKey="hoverRegionName"
				title="Region"
				placeholder="Vælg region"
				open={regionsOpen()}
				setOpen={setRegionsOpen}
			/>
			<AccordionList
				items={municipalities()}
				storeActiveKey="activeMunicipalityName"
				storeHoverKey="hoverMunicipalityName"
				title="Municipalities"
				placeholder="Vælg kommune"
				open={municipalitiesOpen()}
				setOpen={setMunicipalitiesOpen}
				disabled={municipalitiesDisabled()}
			/>
			<AccordionList
				items={schools()}
				storeActiveKey="activeSchoolName"
				storeHoverKey="hoverSchoolName"
				title="Schools"
				placeholder="Vælg skole"
				open={schoolsOpen()}
				setOpen={setSchoolsOpen}
				disabled={schoolsDisabled()}
			/>
		</div>
	);
};
