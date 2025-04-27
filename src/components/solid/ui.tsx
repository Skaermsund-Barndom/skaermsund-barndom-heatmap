import { AccordionList } from "@/components/solid/accordion-list";
import { setStore, store } from "@/scripts/store";
import {
	type VoidComponent,
	createEffect,
	createMemo,
	createSignal,
} from "solid-js";

export const Ui: VoidComponent = () => {
	const [regionsOpen, setRegionsOpen] = createSignal(true);
	const [municipalitiesOpen, setMunicipalitiesOpen] = createSignal(false);
	const [schoolsOpen, setSchoolsOpen] = createSignal(false);

	const municipalitiesDisabled = createMemo(
		() =>
			!store
				.regionsCollection()
				?.features.find((f) => f.properties.r_id === store.activeRegionId),
	);

	const schoolsDisabled = createMemo(
		() =>
			!store
				.municipalitiesCollection()
				?.features.find(
					(f) => f.properties.m_id === store.activeMunicipalityId,
				),
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
				items={
					store.regionsCollection()?.features.map((f) => ({
						id: f.properties.r_id,
						name: f.properties.r_name,
						subs: f.properties.subs,
					})) ?? []
				}
				storeActiveKey="activeRegionId"
				storeHoverKey="regionId"
				placeholder="Vælg region"
				open={regionsOpen()}
				setOpen={setRegionsOpen}
				setLevel={() => setStore("level", 1)}
			/>
			<AccordionList
				items={
					store.municipalitiesCollection()?.features.map((f) => ({
						id: f.properties.m_id,
						name: f.properties.m_name,
						subs: f.properties.subs,
					})) ?? []
				}
				storeActiveKey="activeMunicipalityId"
				storeHoverKey="municipalityId"
				placeholder="Vælg kommune"
				open={municipalitiesOpen()}
				setOpen={setMunicipalitiesOpen}
				disabled={municipalitiesDisabled()}
				setLevel={() => setStore("level", 2)}
			/>
			<AccordionList
				items={
					store.schoolsCollection()?.features.map((f) => ({
						id: f.properties.s_id,
						name: f.properties.s_name,
						subs: f.properties.subs,
					})) ?? []
				}
				storeActiveKey="activeSchoolId"
				storeHoverKey="schoolId"
				placeholder="Vælg skole"
				open={schoolsOpen()}
				setOpen={setSchoolsOpen}
				disabled={schoolsDisabled()}
				setLevel={() => {}}
			/>
		</div>
	);
};
