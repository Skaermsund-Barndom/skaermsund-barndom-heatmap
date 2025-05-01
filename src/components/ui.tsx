import { AccordionList } from "@/components/accordion-list";
import type { AppProps } from "@/components/app";
import { LEVELS } from "@/scripts/const";
import { setStore, store } from "@/scripts/store";
import { feature } from "@turf/turf";
import { type VoidComponent, createMemo } from "solid-js";

interface Props extends AppProps {}

export const Ui: VoidComponent<Props> = (props) => {
	const allRegionsFeature = createMemo(() =>
		feature(null, {
			id: 0,
			filter: Array.from(store.allMunicipalitiesIds),
			name: "Alle regioner",
			subs: store.allSubs,
		}),
	);

	const allMunicipalitiesFeature = createMemo(() =>
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
					allRegionsFeature(),
					...(props.regionCollection?.features ?? []),
				]}
				placeholder="Region"
				isOpen={store.level.id === LEVELS[0].id}
				onClickAccordion={() =>
					setStore({
						level: LEVELS[0],
						filter: store.allRegionsIds,
					})
				}
				onClickFeature={() => setStore({ level: LEVELS[1] })}
			/>

			{/* Municipality list */}
			<AccordionList
				{...props}
				features={[
					allMunicipalitiesFeature(),
					...(props.municipalityCollection?.features.filter((f) =>
						store.filter.has(f.properties.id),
					) ?? []),
				]}
				placeholder="Kommune"
				isOpen={store.level.id === LEVELS[1].id}
				onClickAccordion={() =>
					setStore({
						level: LEVELS[1],
						filter: store.allMunicipalitiesIds,
					})
				}
				onClickFeature={() => setStore({ level: LEVELS[2] })}
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
				isOpen={store.level.id === LEVELS[2].id}
				onClickAccordion={() =>
					setStore({
						level: LEVELS[2],
						filter: store.allSchoolsIds,
					})
				}
			/>
		</div>
	);
};
