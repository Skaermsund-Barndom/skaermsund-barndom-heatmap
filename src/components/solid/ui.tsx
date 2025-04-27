import { AccordionList } from "@/components/solid/accordion-list";
import { ALL_ID } from "@/scripts/const";
import { hoverStore, setHoverStore, setStore, store } from "@/scripts/store";
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

	createEffect(() => {
		if (!store.activeRegionId) {
			setRegionsOpen(false);
		}
	});

	return (
		<div class="hidden h-fit max-h-full w-full grid-cols-1 items-start gap-6 overflow-hidden p-6 md:grid">
			<AccordionList
				items={[
					{
						id: ALL_ID,
						name: "Alle regioner",
						subs:
							store
								.regionsCollection()
								?.features.reduce((acc, f) => acc + f.properties.subs, 0) ?? 0,
					},
					...(store.regionsCollection()?.features.map((f) => f.properties)
						?? []),
				]}
				placeholder="Vælg region"
				open={regionsOpen()}
				setOpen={setRegionsOpen}
				setLevel={() => setStore("level", 1)}
				setActive={(id: number) => setStore("activeRegionId", id)}
				setHover={(id: number) => setHoverStore("regionId", id)}
				hoverId={hoverStore.regionId}
			/>
			<AccordionList
				items={[
					{
						id: ALL_ID,
						name: "Alle kommuner",
						subs:
							store
								.municipalitiesCollection()
								?.features.reduce((acc, f) => acc + f.properties.subs, 0) ?? 0,
					},
					...(store
						.municipalitiesCollection()
						?.features.map((f) => f.properties) ?? []),
				]}
				placeholder="Vælg kommune"
				open={municipalitiesOpen()}
				setOpen={setMunicipalitiesOpen}
				setLevel={() => setStore("level", 2)}
				setActive={(id: number) => setStore("activeMunicipalityId", id)}
				setHover={(id: number) => setHoverStore("municipalityId", id)}
				hoverId={hoverStore.municipalityId}
			/>
			<AccordionList
				items={[
					{
						id: ALL_ID,
						name: "Alle skoler",
						subs:
							store
								.schoolsCollection()
								?.features.reduce((acc, f) => acc + f.properties.subs, 0) ?? 0,
					},
					...(store.schoolsCollection()?.features.map((f) => f.properties)
						?? []),
				]}
				placeholder="Vælg skole"
				open={schoolsOpen()}
				setOpen={setSchoolsOpen}
				setLevel={() => {}}
				setActive={(id: number) => setStore("activeSchoolId", id)}
				setHover={(id: number) => setHoverStore("schoolId", id)}
				hoverId={hoverStore.schoolId}
			/>
		</div>
	);
};
