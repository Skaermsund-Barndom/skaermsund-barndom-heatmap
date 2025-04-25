import { Heatmap } from "@/components/solid/heatmap";
import { UI } from "@/components/solid/ui";
import { AppContext } from "@/scripts/app-context";
import type { SchoolProperties } from "@/scripts/types";
import type { FeatureCollection, MultiPolygon, Point, Polygon } from "geojson";
import type { ParentComponent } from "solid-js";
import { createStore } from "solid-js/store";

export interface AppProps {
	municipalitiesMap?: FeatureCollection<Polygon | MultiPolygon>;
	schools?: FeatureCollection<Point, SchoolProperties>;
}

export const App: ParentComponent<AppProps> = (props) => {
	const [appStore] = createStore<AppProps>({
		schools: props.schools,
		municipalitiesMap: props.municipalitiesMap,
	});

	return (
		<div class="fixed inset-0 grid h-full rounded-[1.5rem] bg-white p-1 md:grid-cols-[25rem_1fr]">
			<AppContext.Provider value={appStore}>
				<UI />
				<Heatmap />
			</AppContext.Provider>
		</div>
	);
};
