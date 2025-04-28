import { HeatmapLayer } from "@/components/solid/heatmap-layer";
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
				source={geojsonSource(store.regionsCollection(), "id")}
				sourceId="regions"
				size={{
					circleMin: 16,
					circleMax: 32,
					textMin: 14,
					textMax: 20,
				}}
				level={0}
				setLevel={() => setStore("level", 1)}
			/>

			{/* Municipalities */}
			<HeatmapLayer
				map={props.map}
				source={geojsonSource(store.municipalitiesCollection(), "id")}
				sourceId="municipalities"
				size={{
					circleMin: 14,
					circleMax: 28,
					textMin: 14,
					textMax: 20,
				}}
				level={1}
				setLevel={() => setStore("level", 2)}
			/>

			{/* Schools */}
			<HeatmapLayer
				map={props.map}
				source={geojsonSource(store.schoolsCollection(), "id")}
				sourceId="schools"
				size={{
					circleMin: 10,
					circleMax: 20,
					textMin: 12,
					textMax: 18,
				}}
				level={2}
				setLevel={() => {}}
			/>
		</>
	);
};
