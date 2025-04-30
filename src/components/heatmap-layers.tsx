import { HeatmapLayer } from "@/components/heatmap-layer";
import { LEVELS } from "@/scripts/const";
import { geojsonSource } from "@/scripts/helpers";
import { setStore } from "@/scripts/store";
import type { MapProps } from "@/scripts/types";
import type { VoidComponent } from "solid-js";

const REGION_SOURCE_ID = "regions";
const MUNICIPALITY_SOURCE_ID = "municipalities";
const SCHOOL_SOURCE_ID = "schools";

interface Props extends MapProps {}

export const HeatmapLayers: VoidComponent<Props> = (props) => {
	return (
		<>
			{/* Regions */}
			<HeatmapLayer
				{...props}
				source={geojsonSource(props.regionCollection, "id")}
				sourceId={REGION_SOURCE_ID}
				size={{
					circleDisabled: 12,
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
				sourceId={MUNICIPALITY_SOURCE_ID}
				size={{
					circleDisabled: 10,
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
				sourceId={SCHOOL_SOURCE_ID}
				size={{
					circleDisabled: 8,
					circleMin: 10,
					circleMax: 20,
					textMin: 14,
					textMax: 18,
				}}
				levelId={LEVELS[2].id}
			/>
		</>
	);
};
