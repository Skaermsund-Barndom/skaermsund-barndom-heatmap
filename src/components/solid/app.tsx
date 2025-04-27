import { Heatmap } from "@/components/solid/heatmap";
import { Ui } from "@/components/solid/ui";
import {
	municipalitiesCollection,
	regionsCollection,
	schoolsCollection,
} from "@/scripts/collections";
import { setStore, type store } from "@/scripts/store";
import type { ParentComponent } from "solid-js";
import { createEffect } from "solid-js";

interface Props {
	municipalitiesMap?: typeof store.municipalitiesMap;
	schools?: typeof store.schools;
}

export const App: ParentComponent<Props> = (props) => {
	createEffect(() => {
		setStore({
			municipalitiesMap: props.municipalitiesMap,
			schools: props.schools,
			schoolsCollection,
			regionsCollection,
			municipalitiesCollection,
		});
	});

	return (
		<div class="fixed inset-0 grid h-full rounded-[1.5rem] bg-white p-1 md:grid-cols-[25rem_1fr]">
			<Ui />
			<Heatmap />
		</div>
	);
};
