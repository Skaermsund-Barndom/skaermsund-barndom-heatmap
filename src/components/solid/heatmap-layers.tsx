import { HeatmapLayer } from "@/components/solid/heatmap-layer";
import { LEVELS } from "@/scripts/const";
import { geojsonSource } from "@/scripts/helpers";
import { setStore, store } from "@/scripts/store";
import type { MapProps } from "@/scripts/types";
import type { VoidComponent } from "solid-js";

interface Props extends MapProps {}

export const HeatmapLayers: VoidComponent<Props> = (props) => {
	return (
		<>
			{/* Regions */}
			<HeatmapLayer
				map={props.map}
				source={geojsonSource(store.regionCollection, "id")}
				sourceId="regions"
				size={{
					circleMin: 16,
					circleMax: 32,
					textMin: 14,
					textMax: 20,
				}}
				levelId={LEVELS[0].id}
				click={() => {
					setStore({ levelId: LEVELS[1].id });
				}}
			/>

			{/* Municipalities */}
			<HeatmapLayer
				map={props.map}
				source={geojsonSource(store.municipalityCollection, "id")}
				sourceId="municipalities"
				size={{
					circleMin: 14,
					circleMax: 28,
					textMin: 14,
					textMax: 20,
				}}
				levelId={LEVELS[1].id}
				click={() => {
					setStore({ levelId: LEVELS[2].id });
				}}
			/>

			{/* Schools */}
			<HeatmapLayer
				map={props.map}
				source={geojsonSource(store.schoolCollection, "id")}
				sourceId="schools"
				size={{
					circleMin: 10,
					circleMax: 20,
					textMin: 12,
					textMax: 18,
				}}
				levelId={LEVELS[2].id}
			/>
		</>
	);
};
