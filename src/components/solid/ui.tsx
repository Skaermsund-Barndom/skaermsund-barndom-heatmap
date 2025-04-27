import { AccordionList } from "@/components/solid/accordion-list";
import { store } from "@/scripts/store";
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
			!store.regionsCollection?.features.find(
				(f) => f.properties.r_id === store.activeRegionId,
			),
	);

	const schoolsDisabled = createMemo(
		() =>
			!store.municipalitiesCollection?.features.find(
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
					store.regionsCollection?.features.map((f) => ({
						id: f.properties.r_id,
						name: f.properties.r_name,
						subs: f.properties.subs,
					})) ?? []
				}
				storeActiveKey="activeRegionId"
				storeHoverKey="hoverRegionId"
				placeholder="Vælg region"
				open={regionsOpen()}
				setOpen={setRegionsOpen}
			/>
			<AccordionList
				items={
					store.municipalitiesCollection?.features
						.filter((f) => f.properties.r_id === store.activeRegionId)
						.map((f) => ({
							id: f.properties.m_id,
							name: f.properties.m_name,
							subs: f.properties.subs,
						})) ?? []
				}
				storeActiveKey="activeMunicipalityId"
				storeHoverKey="hoverMunicipalityId"
				placeholder="Vælg kommune"
				open={municipalitiesOpen()}
				setOpen={setMunicipalitiesOpen}
				disabled={municipalitiesDisabled()}
			/>
			<AccordionList
				items={
					store.schools?.features
						.filter((f) => f.properties.m_id === store.activeMunicipalityId)
						.map((f) => ({
							id: f.properties.s_id,
							name: f.properties.s_name,
							subs: f.properties.subs,
						})) ?? []
				}
				storeActiveKey="activeSchoolId"
				storeHoverKey="hoverSchoolId"
				placeholder="Vælg skole"
				open={schoolsOpen()}
				setOpen={setSchoolsOpen}
				disabled={schoolsDisabled()}
			/>
		</div>
	);
};
