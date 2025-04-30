import { Heatmap } from "@/components/heatmap";
import { Ui } from "@/components/ui";
import { setStore } from "@/scripts/store";
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
		const allRegionsIds = new Set(
			props.regionCollection?.features.map((f) => f.properties.id),
		);
		const allMunicipalitiesIds = new Set(
			props.municipalityCollection?.features.map((f) => f.properties.id),
		);
		const allSchoolsIds = new Set(
			props.schoolCollection?.features.map((f) => f.properties.id),
		);
		const allSubs =
			props.schoolCollection?.features.reduce(
				(acc, f) => acc + f.properties.subs,
				0,
			) ?? 0;

		setStore({
			filter: allRegionsIds,
			allRegionsIds,
			allMunicipalitiesIds,
			allSchoolsIds,
			allSubs,
		});
	});

	return (
		<div class="fixed inset-0 grid h-full rounded-[1.5rem] bg-white p-1 md:grid-cols-[25rem_1fr]">
			<Ui {...props} />
			<Heatmap {...props} />
		</div>
	);
};
