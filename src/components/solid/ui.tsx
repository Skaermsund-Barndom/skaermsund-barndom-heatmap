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
			appStore?.schools?.features.reduce(
				(acc, school) => {
					const regionId = school.properties.r_id;
					const regionName = school.properties.r_name;
					if (!acc.find((r) => r.id === regionId)) {
						acc.push({ id: regionId, name: regionName });
					}
					return acc;
				},
				[] as { id: number; name: string }[],
			) ?? [];

		return reducedRegions;
	});

	const municipalities = createMemo(() => {
		const reducedMunicipalities =
			appStore?.schools?.features.reduce(
				(acc, school) => {
					const municipalityId = school.properties.m_id;
					const municipalityName = school.properties.m_name;
					if (
						!acc.find((m) => m.id === municipalityId)
						&& store.activeRegionId === school.properties.r_id
					) {
						acc.push({ id: municipalityId, name: municipalityName });
					}
					return acc;
				},
				[] as { id: number; name: string }[],
			) ?? [];
		return reducedMunicipalities;
	});

	const schools = createMemo(() => {
		const reducedSchools =
			appStore?.schools?.features.reduce(
				(acc, school) => {
					const schoolId = school.properties.s_id;
					const schoolName = school.properties.s_name;
					if (
						!acc.find((s) => s.id === schoolId)
						&& store.activeMunicipalityId === school.properties.m_id
					) {
						acc.push({ id: schoolId, name: schoolName });
					}
					return acc;
				},
				[] as { id: number; name: string }[],
			) ?? [];
		return reducedSchools;
	});

	const municipalitiesDisabled = createMemo(
		() => !regions().find((r) => r.id === store.activeRegionId),
	);

	const schoolsDisabled = createMemo(
		() => !municipalities().find((m) => m.id === store.activeMunicipalityId),
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
				storeActiveKey="activeRegionId"
				storeHoverKey="hoverRegionId"
				title="Region"
				placeholder="Vælg region"
				open={regionsOpen()}
				setOpen={setRegionsOpen}
			/>
			<AccordionList
				items={municipalities()}
				storeActiveKey="activeMunicipalityId"
				storeHoverKey="hoverMunicipalityId"
				title="Municipalities"
				placeholder="Vælg kommune"
				open={municipalitiesOpen()}
				setOpen={setMunicipalitiesOpen}
				disabled={municipalitiesDisabled()}
			/>
			<AccordionList
				items={schools()}
				storeActiveKey="activeSchoolId"
				storeHoverKey="hoverSchoolId"
				title="Schools"
				placeholder="Vælg skole"
				open={schoolsOpen()}
				setOpen={setSchoolsOpen}
				disabled={schoolsDisabled()}
			/>
		</div>
	);
};
