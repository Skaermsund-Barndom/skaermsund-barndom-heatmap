import { HeatmapLayer } from "@/components/solid/heatmap-layer";
import { ZOOM_LEVELS } from "@/scripts/const";
import { geojsonSource } from "@/scripts/helpers";
import { store } from "@/scripts/store";
import type { MapProps } from "@/scripts/types";
import type { VoidComponent } from "solid-js";

interface Props extends MapProps {}

export const HeatmapLayers: VoidComponent<Props> = (props) => {
	return (
		<>
			{/* Regions */}
			<HeatmapLayer
				map={props.map}
				source={geojsonSource(store.regionsCollection, "r_id")}
				sourceId="regions"
				circleLayerId="regions-circle"
				textLayerId="regions-text"
				circleActiveLayerId="regions-circle-active"
				textActiveLayerId="regions-text-active"
				circleMinRadius={20}
				circleMaxRadius={60}
				textMinSize={14}
				textMaxSize={20}
				zoomLevels={{
					minzoom: ZOOM_LEVELS.REGION,
					maxzoom: ZOOM_LEVELS.MUNICIPALITY,
				}}
				name="r_name"
				id="r_id"
				storeIdentifier="hoverRegionId"
			/>

			{/* Municipalities */}
			<HeatmapLayer
				map={props.map}
				source={geojsonSource(store.municipalitiesCollection, "m_id")}
				sourceId="municipalities"
				circleLayerId="municipalities-circle"
				textLayerId="municipalities-text"
				circleActiveLayerId="municipalities-circle-active"
				textActiveLayerId="municipalities-text-active"
				circleMinRadius={20}
				circleMaxRadius={60}
				textMinSize={14}
				textMaxSize={20}
				zoomLevels={{
					minzoom: ZOOM_LEVELS.MUNICIPALITY,
					maxzoom: ZOOM_LEVELS.SCHOOL,
				}}
				name="m_name"
				id="m_id"
				storeIdentifier="hoverMunicipalityId"
			/>

			{/* Schools */}
			<HeatmapLayer
				map={props.map}
				source={geojsonSource(store.schools, "s_id")}
				sourceId="schools"
				circleLayerId="schools-circle"
				textLayerId="schools-text"
				circleActiveLayerId="schools-circle-active"
				textActiveLayerId="schools-text-active"
				circleMinRadius={10}
				circleMaxRadius={40}
				textMinSize={12}
				textMaxSize={18}
				zoomLevels={{
					minzoom: ZOOM_LEVELS.SCHOOL,
					maxzoom: ZOOM_LEVELS.MAX,
				}}
				name="s_name"
				id="s_id"
				storeIdentifier="hoverSchoolId"
			/>
		</>
	);
};
