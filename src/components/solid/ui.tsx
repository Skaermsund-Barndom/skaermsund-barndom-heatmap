import { AccordionList } from "@/components/solid/accordion-list";
import { LEVELS } from "@/scripts/const";
import { setStore, store } from "@/scripts/store";
import { type VoidComponent, createSignal } from "solid-js";

export const Ui: VoidComponent = () => {
	const [regionsOpen, setRegionsOpen] = createSignal(true);
	const [municipalitiesOpen, setMunicipalitiesOpen] = createSignal(false);
	const [schoolsOpen, setSchoolsOpen] = createSignal(false);

	return (
		<div class="hidden h-fit max-h-full w-full grid-cols-1 items-start gap-6 overflow-hidden p-6 md:grid">
			<AccordionList
				items={[
					{
						id: 0,
						filter:
							store.regionsCollection()?.features.map((f) => f.properties.id)
							?? [],
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
				setLevel={() => setStore("levelId", LEVELS[1].id)}
			/>
			<AccordionList
				items={[
					{
						id: 0,
						filter:
							store
								.municipalitiesCollection()
								?.features.map((f) => f.properties.id) ?? [],
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
				setLevel={() => setStore("levelId", LEVELS[2].id)}
			/>
			<AccordionList
				items={[
					{
						id: 0,
						filter:
							store.schoolsCollection()?.features.map((f) => f.properties.id)
							?? [],
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
			/>
		</div>
	);
};
