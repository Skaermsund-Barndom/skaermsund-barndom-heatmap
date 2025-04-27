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
				source={geojsonSource(store.regionsCollection(), "r_id")}
				sourceId="regions"
				circleMinRadius={16}
				circleMaxRadius={32}
				textMinSize={14}
				textMaxSize={20}
				name="r_name"
				id="r_id"
				hoverId="regionId"
				activeId="activeRegionId"
				level={0}
				setLevel={() => setStore("level", 1)}
			/>

			{/* Municipalities */}
			<HeatmapLayer
				map={props.map}
				source={geojsonSource(store.municipalitiesCollection(), "m_id")}
				sourceId="municipalities"
				circleMinRadius={14}
				circleMaxRadius={28}
				textMinSize={14}
				textMaxSize={20}
				name="m_name"
				id="m_id"
				hoverId="municipalityId"
				activeId="activeMunicipalityId"
				level={1}
				setLevel={() => setStore("level", 2)}
			/>

			{/* Schools */}
			<HeatmapLayer
				map={props.map}
				source={geojsonSource(store.schoolsCollection(), "s_id")}
				sourceId="schools"
				circleMinRadius={10}
				circleMaxRadius={20}
				textMinSize={12}
				textMaxSize={18}
				name="s_name"
				id="s_id"
				hoverId="schoolId"
				activeId="activeSchoolId"
				level={2}
				setLevel={() => {}}
			/>
		</>
	);
};
