import { Heatmap } from "@/components/solid/heatmap";
import { Ui } from "@/components/solid/ui";
import { setStore, type store } from "@/scripts/store";
import type { ParentComponent } from "solid-js";
import { createEffect } from "solid-js";

interface Props {
	municipalitiesMap?: typeof store.municipalitiesMap;
	schoolCollection?: typeof store.schoolCollection;
	municipalityCollection?: typeof store.municipalityCollection;
	regionCollection?: typeof store.regionCollection;
}

export const App: ParentComponent<Props> = (props) => {
	createEffect(() => {
		setStore({
			municipalitiesMap: props.municipalitiesMap,
			schoolCollection: props.schoolCollection,
			municipalityCollection: props.municipalityCollection,
			regionCollection: props.regionCollection,
			filter: props.schoolCollection?.features.reduce<number[]>((filter, f) => {
				if (filter.includes(f.properties.r_id)) {
					return filter;
				}
				filter.push(f.properties.r_id);
				return filter;
			}, []),
		});
	});

	return (
		<div class="fixed inset-0 grid h-full rounded-[1.5rem] bg-white p-1 md:grid-cols-[25rem_1fr]">
			<Ui />
			<Heatmap />
		</div>
	);
};
