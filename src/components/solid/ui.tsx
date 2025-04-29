import { AccordionList } from "@/components/solid/accordion-list";
import type { AppProps } from "@/components/solid/app";
import { LEVELS } from "@/scripts/const";
import { setStore, store } from "@/scripts/store";
import { type VoidComponent, createMemo } from "solid-js";

interface Props extends AppProps {}

export const Ui: VoidComponent<Props> = (props) => {
	const allRegionsItem = createMemo(() => ({
		id: 0,
		filter: store.allMunicipalities(props.schoolCollection),
		name: "Alle regioner",
		subs: store.allSubs(props.schoolCollection),
	}));

	const allMunicipalitiesItem = createMemo(() => ({
		id: 0,
		filter: store.allSchools(props.schoolCollection),
		name: "Alle kommuner",
		subs: store.allSubs(props.schoolCollection),
	}));

	return (
		<div class="hidden h-fit max-h-full w-full grid-cols-1 items-start gap-6 overflow-hidden overflow-y-auto p-6 md:grid">
			{/* Region list */}
			<AccordionList
				{...props}
				items={[
					allRegionsItem(),
					...(props.regionCollection?.features.map((f) => f.properties) ?? []),
				]}
				placeholder="Region"
				isOpen={store.levelId === LEVELS[0].id}
				onClickAccordion={() =>
					setStore({
						levelId: LEVELS[0].id,
						filter: store.allRegions(props.schoolCollection),
					})
				}
				onClickItem={() => setStore({ levelId: LEVELS[1].id })}
			/>

			{/* Municipality list */}
			<AccordionList
				{...props}
				items={[
					allMunicipalitiesItem(),
					...(props.municipalityCollection?.features
						.filter((f) => store.filter.includes(f.properties.id))
						.map((f) => f.properties) ?? []),
				]}
				placeholder="Kommune"
				isOpen={store.levelId === LEVELS[1].id}
				onClickAccordion={() =>
					setStore({
						levelId: LEVELS[1].id,
						filter: store.allMunicipalities(props.schoolCollection),
					})
				}
				onClickItem={() => setStore({ levelId: LEVELS[2].id })}
			/>

			{/* School list */}
			<AccordionList
				{...props}
				items={
					props.schoolCollection?.features
						.filter((f) => store.filter.includes(f.properties.id))
						.map((f) => f.properties) ?? []
				}
				placeholder="Skole"
				isOpen={store.levelId === LEVELS[2].id}
				onClickAccordion={() =>
					setStore({
						levelId: LEVELS[2].id,
						filter: store.allSchools(props.schoolCollection),
					})
				}
			/>
		</div>
	);
};
