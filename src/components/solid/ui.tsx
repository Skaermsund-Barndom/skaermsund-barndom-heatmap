import { AccordionList } from "@/components/solid/accordion-list";
import { setStore, store } from "@/scripts/store";
import { type VoidComponent, createEffect, createSignal } from "solid-js";

export const Ui: VoidComponent = () => {
	const [regionsOpen, setRegionsOpen] = createSignal(true);
	const [municipalitiesOpen, setMunicipalitiesOpen] = createSignal(false);
	const [schoolsOpen, setSchoolsOpen] = createSignal(false);

	createEffect(() => {
		if (!regionsOpen()) {
			setMunicipalitiesOpen(true);
		} else {
			setMunicipalitiesOpen(false);
		}
	});

	createEffect(() => {
		if (!regionsOpen() && !municipalitiesOpen()) {
			setSchoolsOpen(true);
		} else {
			setSchoolsOpen(false);
		}
	});

	return (
		<div class="hidden h-fit max-h-full w-full grid-cols-1 items-start gap-6 overflow-hidden p-6 md:grid">
			<AccordionList
				items={[
					{
						id: 0,
						name: "Alle regioner",
						subs: store
							.regionsCollection()
							?.features.reduce((acc, f) => acc + f.properties.subs, 0),
					},
					...(store.regionsCollection()?.features.map((f) => ({
						id: f.properties.r_id,
						name: f.properties.r_name,
						subs: f.properties.subs,
					})) ?? []),
				]}
				storeActiveKey="activeRegionId"
				storeHoverKey="regionId"
				placeholder="Vælg region"
				open={regionsOpen()}
				setOpen={setRegionsOpen}
				setLevel={() => setStore("level", 1)}
			/>
			<AccordionList
				items={[
					{
						id: 0,
						name: "Alle kommuner",
						subs: store
							.municipalitiesCollection()
							?.features.reduce((acc, f) => acc + f.properties.subs, 0),
					},
					...(store.municipalitiesCollection()?.features.map((f) => ({
						id: f.properties.m_id,
						name: f.properties.m_name,
						subs: f.properties.subs,
					})) ?? []),
				]}
				storeActiveKey="activeMunicipalityId"
				storeHoverKey="municipalityId"
				placeholder="Vælg kommune"
				open={municipalitiesOpen()}
				setOpen={setMunicipalitiesOpen}
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
				setLevel={() => {}}
			/>
		</div>
	);
};
