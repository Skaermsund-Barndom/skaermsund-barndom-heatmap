import { AccordionList } from "@/components/accordion-list";
import type { AppProps } from "@/components/app";
import { LEVELS } from "@/scripts/const";
import { setStore, store } from "@/scripts/store";
import { feature } from "@turf/turf";
import { type VoidComponent, createMemo } from "solid-js";

interface Props extends AppProps {}

export const Ui: VoidComponent<Props> = (props) => {
	const allRegionsItem = createMemo(() =>
		feature(null, {
			id: 0,
			filter: Array.from(store.allMunicipalitiesIds),
			name: "Alle regioner",
			subs: store.allSubs,
		}),
	);

	const allMunicipalitiesItem = createMemo(() =>
		feature(null, {
			id: 0,
			filter: Array.from(store.allSchoolsIds),
			name: "Alle kommuner",
			subs: store.allSubs,
		}),
	);

	return (
		<div class="hidden h-fit max-h-full w-full grid-cols-1 items-start gap-6 overflow-hidden overflow-y-auto p-6 md:grid">
			{/* Region list */}
			<AccordionList
				{...props}
				features={[
					allRegionsItem(),
					...(props.regionCollection?.features ?? []),
				]}
				placeholder="Region"
				isOpen={store.levelId === LEVELS[0].id}
				onClickAccordion={() =>
					setStore({
						levelId: LEVELS[0].id,
						filter: store.allRegionsIds,
					})
				}
				onClickItem={() => setStore({ levelId: LEVELS[1].id })}
			/>

			{/* Municipality list */}
			<AccordionList
				{...props}
				features={[
					allMunicipalitiesItem(),
					...(props.municipalityCollection?.features.filter((f) =>
						store.filter.has(f.properties.id),
					) ?? []),
				]}
				placeholder="Kommune"
				isOpen={store.levelId === LEVELS[1].id}
				onClickAccordion={() =>
					setStore({
						levelId: LEVELS[1].id,
						filter: store.allMunicipalitiesIds,
					})
				}
				onClickItem={() => setStore({ levelId: LEVELS[2].id })}
			/>

			{/* School list */}
			<AccordionList
				{...props}
				features={
					props.schoolCollection?.features.filter((f) =>
						store.filter.has(f.properties.id),
					) ?? []
				}
				placeholder="Skole"
				isOpen={store.levelId === LEVELS[2].id}
				onClickAccordion={() =>
					setStore({
						levelId: LEVELS[2].id,
						filter: store.allSchoolsIds,
					})
				}
			/>
		</div>
	);
};
