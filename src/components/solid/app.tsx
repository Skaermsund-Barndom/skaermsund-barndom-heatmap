import { Heatmap } from "@/components/solid/heatmap";
import { Ui } from "@/components/solid/ui";
import type {
	municipalityCollection,
	regionCollection,
	schoolCollection,
} from "@/scripts/collections";
import type { municipalityMapCollection } from "@/scripts/municipality-map";
import { setStore, store } from "@/scripts/store";
import type { VoidComponent } from "solid-js";
import { createEffect } from "solid-js";

export interface AppProps {
	municipalityMap?: Awaited<ReturnType<typeof municipalityMapCollection>>;
	schoolCollection?: Awaited<ReturnType<typeof schoolCollection>>;
	municipalityCollection?: Awaited<ReturnType<typeof municipalityCollection>>;
	regionCollection?: Awaited<ReturnType<typeof regionCollection>>;
	initialBounds?: [number, number, number, number];
}

export const App: VoidComponent<AppProps> = (props) => {
	createEffect(() => {
		setStore({
			filter: store.allRegions(props.schoolCollection),
		});
	});

	return (
		<div class="fixed inset-0 grid h-full rounded-[1.5rem] bg-white p-1 md:grid-cols-[25rem_1fr]">
			<Ui {...props} />
			<Heatmap {...props} />
		</div>
	);
};
