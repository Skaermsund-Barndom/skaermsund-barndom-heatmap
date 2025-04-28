import { AccordionList } from "@/components/solid/accordion-list";
import { LEVELS } from "@/scripts/const";
import { setStore, store } from "@/scripts/store";
import { type VoidComponent, createMemo } from "solid-js";

export const Ui: VoidComponent = () => {
	const allRegionsItem = createMemo(() => ({
		id: 0,
		filter: store.allMunicipalities(),
		name: "Alle regioner",
		subs: store.allSubs(),
	}));

	const allMunicipalitiesItem = createMemo(() => ({
		id: 0,
		filter: store.allSchools(),
		name: "Alle kommuner",
		subs: store.allSubs(),
	}));

	return (
		<div class="hidden h-fit max-h-full w-full grid-cols-1 items-start gap-6 overflow-hidden p-6 md:grid">
			{/* Region list */}
			<AccordionList
				items={[
					allRegionsItem(),
					...(store.regionCollection?.features.map((f) => f.properties) ?? []),
				]}
				placeholder="Region"
				isOpen={store.levelId === LEVELS[0].id}
				onClickAccordion={() =>
					setStore({ levelId: LEVELS[0].id, filter: store.allRegions() })
				}
				onClickItem={() => setStore({ levelId: LEVELS[1].id })}
			/>

			{/* Municipality list */}
			<AccordionList
				items={[
					allMunicipalitiesItem(),
					...(store.municipalityCollection?.features
						.filter((f) => store.filter.includes(f.properties.id))
						.map((f) => f.properties) ?? []),
				]}
				placeholder="Kommune"
				isOpen={store.levelId === LEVELS[1].id}
				onClickAccordion={() =>
					setStore({ levelId: LEVELS[1].id, filter: store.allMunicipalities() })
				}
				onClickItem={() => setStore({ levelId: LEVELS[2].id })}
			/>

			{/* School list */}
			<AccordionList
				items={
					store.schoolCollection?.features
						.filter((f) => store.filter.includes(f.properties.id))
						.map((f) => f.properties) ?? []
				}
				placeholder="Skole"
				isOpen={store.levelId === LEVELS[2].id}
				onClickAccordion={() =>
					setStore({ levelId: LEVELS[2].id, filter: store.allSchools() })
				}
			/>
		</div>
	);
};
