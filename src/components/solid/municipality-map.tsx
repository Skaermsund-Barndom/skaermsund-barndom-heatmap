import { GeoJSONSource } from "@/components/maplibre/geojson-source";
import { Layer } from "@/components/maplibre/layer";
import { AppContext } from "@/scripts/app-context";
import { COLORS } from "@/scripts/const";
import { geojsonSource } from "@/scripts/helpers";
import { store } from "@/scripts/store";
import type { MapProps } from "@/scripts/types";
import type { VoidComponent } from "solid-js";
import { createEffect, useContext } from "solid-js";

const MUNICIPALITY_MAP_SOURCE = "municipalities-map";
const MUNICIPALITY_MAP_HEATMAP_LAYER = "municipalities-map-heatmap";
const MUNICIPALITY_MAP_BORDER_LAYER = "municipalities-map-border";

interface Props extends MapProps {
	beforeId?: string;
}

export const MunicipalityMap: VoidComponent<Props> = (props) => {
	const appStore = useContext(AppContext);

	createEffect(() => {
		if (store.activeMunicipalityId) {
			const activeMunicipalityFeatures =
				props.map
					.querySourceFeatures(MUNICIPALITY_MAP_SOURCE)
					.map((feature) => ({
						active:
							Number(feature.properties?.kommunekod)
							=== store.activeMunicipalityId,
						feature,
					})) ?? [];
			if (!activeMunicipalityFeatures.length) return;

			for (const { feature, active } of activeMunicipalityFeatures) {
				if (!feature.id) continue;
				const featureIdentifier = {
					id: feature.id,
					source: MUNICIPALITY_MAP_SOURCE,
				};
				props.map.setFeatureState(featureIdentifier, { active });
			}
		}
	});

	createEffect(() => {
		if (store.activeRegionId) {
			const activeRegionFeatures =
				props.map
					.querySourceFeatures(MUNICIPALITY_MAP_SOURCE)
					.map((feature) => ({
						active:
							Number(feature.properties?.regionskod) === store.activeRegionId,
						feature,
					})) ?? [];
			if (!activeRegionFeatures.length) return;

			for (const { feature, active } of activeRegionFeatures) {
				if (!feature.id) continue;
				const featureIdentifier = {
					id: feature.id,
					source: MUNICIPALITY_MAP_SOURCE,
				};
				props.map.setFeatureState(featureIdentifier, { active });
			}
		}
	});

	return (
		<GeoJSONSource
			id={MUNICIPALITY_MAP_SOURCE}
			map={props.map}
			source={geojsonSource(appStore?.municipalitiesMap, "kommunekod")}
		>
			<Layer
				beforeId={props.beforeId}
				map={props.map}
				layer={{
					id: MUNICIPALITY_MAP_HEATMAP_LAYER,
					type: "fill",
					source: MUNICIPALITY_MAP_SOURCE,
					paint: {
						"fill-color": [
							"case",
							["boolean", ["feature-state", "active"], false],
							COLORS["--color-container"],
							COLORS["--color-primary-10"],
						],
					},
				}}
			/>
			<Layer
				beforeId={props.beforeId}
				map={props.map}
				layer={{
					id: MUNICIPALITY_MAP_BORDER_LAYER,
					type: "line",
					source: MUNICIPALITY_MAP_SOURCE,
					paint: {
						"line-color": COLORS["--color-secondary"],
						"line-width": 1,
					},
					layout: {
						"line-cap": "round",
						"line-join": "round",
					},
				}}
			/>
		</GeoJSONSource>
	);
};
