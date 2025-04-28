import { GeoJSONSource } from "@/components/maplibre/geojson-source";
import { Layer } from "@/components/maplibre/layer";
import { BG_MUNICIPALITIES_LAYER, COLORS, LEVELS } from "@/scripts/const";
import { geojsonSource } from "@/scripts/helpers";
import { store } from "@/scripts/store";
import type { MapProps } from "@/scripts/types";
import { bbox, featureCollection } from "@turf/turf";
import type { VoidComponent } from "solid-js";
import { createEffect } from "solid-js";

const MUNICIPALITY_MAP_SOURCE = "municipalities-map";
const MUNICIPALITY_MAP_FILL = "municipalities-map-heatmap";
const MUNICIPALITY_MAP_BORDER = "municipalities-map-border";

interface Props extends MapProps {}

export const MunicipalityMap: VoidComponent<Props> = (props) => {
	createEffect(() => {
		if (store.levelId === LEVELS[0].id) {
			if (!store.municipalitiesMap) return;

			const bounds = bbox(store.municipalitiesMap);
			if (bounds.length !== 4) return;

			props.map.fitBounds(bounds, {
				duration: 1000,
				padding: 16,
			});

			for (const feature of store.municipalitiesMap.features) {
				props.map.setFeatureState(
					{
						id: feature.properties.kommunekod,
						source: MUNICIPALITY_MAP_SOURCE,
					},
					{
						active: false,
					},
				);
			}
		}

		if (store.levelId === LEVELS[1].id) {
			if (!store.municipalitiesMap?.features) return;
			const activeMunicipalityCodes = new Set(store.filter);
			const activeMunicipalities = store.municipalitiesMap.features.filter(
				(f) => activeMunicipalityCodes.has(Number(f.properties.kommunekod)),
			);

			if (!activeMunicipalities?.length) return;

			const bounds = bbox(featureCollection(activeMunicipalities));
			if (bounds.length !== 4) return;

			props.map.fitBounds(bounds, {
				duration: 1000,
				padding: 32,
			});

			for (const feature of store.municipalitiesMap.features) {
				props.map.setFeatureState(
					{
						id: feature.properties.kommunekod,
						source: MUNICIPALITY_MAP_SOURCE,
					},
					{
						active: activeMunicipalityCodes.has(
							Number(feature.properties.kommunekod),
						),
					},
				);
			}
		}

		if (store.levelId === LEVELS[2].id) {
			if (
				!store.municipalitiesMap?.features
				|| !store.schoolCollection?.features
			)
				return;

			// Pre-compute the set of municipality IDs for the active schools
			const activeSchoolMunicipalityIds = new Set(
				store.schoolCollection.features
					.filter((school) => store.filter.includes(school.properties.id))
					.map((school) => Number(school.properties.m_id)),
			);

			// Filter municipalities based on the pre-computed set
			const activeMunicipalities = store.municipalitiesMap.features.filter(
				(municipality) =>
					activeSchoolMunicipalityIds.has(
						Number(municipality.properties.kommunekod),
					),
			);

			if (!activeMunicipalities.length) return;

			const bounds = bbox(featureCollection(activeMunicipalities));
			if (bounds.length !== 4) return;

			props.map.fitBounds(bounds, {
				duration: 1000,
				padding: 64,
			});

			for (const feature of store.municipalitiesMap.features) {
				props.map.setFeatureState(
					{
						id: feature.properties.kommunekod,
						source: MUNICIPALITY_MAP_SOURCE,
					},
					{
						active: activeMunicipalities.some(
							(m) => m.properties.kommunekod === feature.properties.kommunekod,
						),
					},
				);
			}
		}
	});

	return (
		<GeoJSONSource
			id={MUNICIPALITY_MAP_SOURCE}
			map={props.map}
			source={geojsonSource(store.municipalitiesMap, "kommunekod")}
		>
			{/* Municipality map layer */}
			<Layer
				beforeId={BG_MUNICIPALITIES_LAYER}
				map={props.map}
				layer={{
					id: MUNICIPALITY_MAP_FILL,
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

			{/* Border layer */}
			<Layer
				beforeId={BG_MUNICIPALITIES_LAYER}
				map={props.map}
				layer={{
					id: MUNICIPALITY_MAP_BORDER,
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
