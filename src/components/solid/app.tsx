import { Heatmap } from "@/components/solid/heatmap";
import { Ui } from "@/components/solid/ui";
import { AppContext } from "@/scripts/app-context";
import {
	municipalitiesCollection,
	regionsCollection,
} from "@/scripts/collections";
import type {
	MunicipalityMapProperties,
	SchoolProperties,
} from "@/scripts/types";
import type { FeatureCollection, MultiPolygon, Point, Polygon } from "geojson";
import type { ParentComponent } from "solid-js";
import { createStore } from "solid-js/store";

interface Props {
	municipalitiesMap?: FeatureCollection<
		Polygon | MultiPolygon,
		MunicipalityMapProperties
	>;
	schools?: FeatureCollection<Point, SchoolProperties>;
}

export interface AppProps extends Props {
	regionsCollection: ReturnType<typeof regionsCollection>;
	municipalitiesCollection: ReturnType<typeof municipalitiesCollection>;
}

export const App: ParentComponent<Props> = (props) => {
	const [appStore] = createStore<AppProps>({
		municipalitiesMap: props.municipalitiesMap,
		schools: props.schools,
		regionsCollection: regionsCollection(props.schools),
		municipalitiesCollection: municipalitiesCollection(props.schools),
	});

	return (
		<div class="fixed inset-0 grid h-full rounded-[1.5rem] bg-white p-1 md:grid-cols-[25rem_1fr]">
			<AppContext.Provider value={appStore}>
				<Ui />
				<Heatmap />
			</AppContext.Provider>
		</div>
	);
};
