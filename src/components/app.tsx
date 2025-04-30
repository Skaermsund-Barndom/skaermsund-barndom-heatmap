import { Heatmap } from "@/components/heatmap";
import { Ui } from "@/components/ui";
import { setStore, store } from "@/scripts/store";
import type {
	MunicipalityCollection,
	MunicipalityMap,
	RegionCollection,
	SchoolCollection,
} from "@/scripts/types";
import type { VoidComponent } from "solid-js";
import { createEffect } from "solid-js";

export interface AppProps {
	municipalityMap?: MunicipalityMap;
	schoolCollection?: SchoolCollection;
	municipalityCollection?: MunicipalityCollection;
	regionCollection?: RegionCollection;
	initialBounds?: [number, number, number, number];
}

export const App: VoidComponent<AppProps> = (props) => {
	createEffect(() => {
		setStore({
			filter: store.allIds(props.regionCollection),
		});
	});

	return (
		<div class="fixed inset-0 grid h-full rounded-[1.5rem] bg-white p-1 md:grid-cols-[25rem_1fr]">
			<Ui {...props} />
			<Heatmap {...props} />
		</div>
	);
};
