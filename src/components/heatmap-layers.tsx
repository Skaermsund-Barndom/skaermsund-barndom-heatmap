import { HeatmapLayer } from "@/components/heatmap-layer";
import { LEVELS } from "@/scripts/const";
import { geojsonSource } from "@/scripts/helpers";
import { setStore } from "@/scripts/store";
import type { MapProps } from "@/scripts/types";
import type { VoidComponent } from "solid-js";

interface Props extends MapProps {}

export const HeatmapLayers: VoidComponent<Props> = (props) => {
	return (
		<>
			{/* Regions */}
			<HeatmapLayer
				{...props}
				source={geojsonSource(props.regionCollection, "id")}
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
				{...props}
				source={geojsonSource(props.municipalityCollection, "id")}
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
				{...props}
				source={geojsonSource(props.schoolCollection, "id")}
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
