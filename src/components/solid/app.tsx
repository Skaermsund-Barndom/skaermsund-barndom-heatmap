import { Heatmap } from "@/components/solid/heatmap";
import { Ui } from "@/components/solid/ui";
import { setStore, store } from "@/scripts/store";
import type { ParentComponent } from "solid-js";
import { createEffect } from "solid-js";

export interface AppProps {
	municipalityMap?: typeof store.municipalityMap;
	schoolCollection?: typeof store.schoolCollection;
	municipalityCollection?: typeof store.municipalityCollection;
	regionCollection?: typeof store.regionCollection;
	initialBounds?: [number, number, number, number];
}

export const App: ParentComponent<AppProps> = (props) => {
	createEffect(() => {
		setStore({
			municipalityMap: props.municipalityMap,
			schoolCollection: props.schoolCollection,
			municipalityCollection: props.municipalityCollection,
			regionCollection: props.regionCollection,
			initialBounds: props.initialBounds,
			filter: store.allRegions(),
		});
	});

	return (
		<div class="fixed inset-0 grid h-full rounded-[1.5rem] bg-white p-1 md:grid-cols-[25rem_1fr]">
			<Ui />
			<Heatmap />
		</div>
	);
};
