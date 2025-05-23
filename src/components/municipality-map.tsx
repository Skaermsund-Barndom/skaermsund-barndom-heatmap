import { GeoJSONSource } from "@/components/geojson-source";
import { Layer } from "@/components/layer";
import { BG_MUNICIPALITIES_LAYER, COLORS, LEVELS } from "@/scripts/const";
import { geojsonSource, remToPx } from "@/scripts/helpers";
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
		if (store.level.id === LEVELS[0].id) {
			if (!props.municipalityMap) return;

			const bounds = bbox(props.municipalityMap);
			if (bounds.length !== 4) return;

			props.map.fitBounds(bounds, {
				duration: 800,
				padding: remToPx(2),
			});

			if (!props.map.getSource(MUNICIPALITY_MAP_SOURCE)) return;
			for (const feature of props.municipalityMap.features) {
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

		if (store.level.id === LEVELS[1].id) {
			if (!props.municipalityMap?.features) return;
			const activeMunicipalitySet = new Set(store.filter);
			const activeMunicipalities = props.municipalityMap.features.filter((f) =>
				activeMunicipalitySet.has(Number(f.properties.kommunekod)),
			);

			if (!activeMunicipalities?.length) return;

			const bounds = bbox(featureCollection(activeMunicipalities));
			if (bounds.length !== 4) return;

			props.map.fitBounds(bounds, {
				duration: 800,
				padding: remToPx(2),
			});

			if (!props.map.getSource(MUNICIPALITY_MAP_SOURCE)) return;
			for (const feature of props.municipalityMap.features) {
				props.map.setFeatureState(
					{
						id: feature.properties.kommunekod,
						source: MUNICIPALITY_MAP_SOURCE,
					},
					{
						active:
							activeMunicipalities.length !== store.allMunicipalitiesIds.size
							&& activeMunicipalitySet.has(
								Number(feature.properties.kommunekod),
							),
					},
				);
			}
		}

		if (store.level.id === LEVELS[2].id) {
			if (!props.municipalityMap?.features || !props.schoolCollection?.features)
				return;

			// Pre-compute the set of municipality IDs for the active schools
			const activeSchoolMunicipalityIds = new Set(
				props.schoolCollection.features
					.filter((school) => store.filter.has(school.properties.id))
					.map((school) => Number(school.properties.m_id)),
			);

			// Filter municipalities based on the pre-computed set
			const activeMunicipalities = props.municipalityMap.features.filter(
				(municipality) =>
					activeSchoolMunicipalityIds.has(
						Number(municipality.properties.kommunekod),
					),
			);

			if (!activeMunicipalities.length) return;

			const bounds = bbox(featureCollection(activeMunicipalities));
			if (bounds.length !== 4) return;

			props.map.fitBounds(bounds, {
				duration: 800,
				padding: remToPx(2),
			});

			if (!props.map.getSource(MUNICIPALITY_MAP_SOURCE)) return;
			for (const feature of props.municipalityMap.features) {
				props.map.setFeatureState(
					{
						id: feature.properties.kommunekod,
						source: MUNICIPALITY_MAP_SOURCE,
					},
					{
						active:
							activeMunicipalities.length !== store.allMunicipalitiesIds.size
							&& activeMunicipalities.some(
								(m) =>
									m.properties.kommunekod === feature.properties.kommunekod,
							),
					},
				);
			}
		}
	});

	return (
		<GeoJSONSource
			{...props}
			id={MUNICIPALITY_MAP_SOURCE}
			source={geojsonSource(props.municipalityMap, "kommunekod")}
		>
			{/* Municipality map layer */}
			<Layer
				{...props}
				beforeId={BG_MUNICIPALITIES_LAYER}
				layer={{
					id: MUNICIPALITY_MAP_FILL,
					type: "fill",
					source: MUNICIPALITY_MAP_SOURCE,
					paint: {
						"fill-color": [
							"case",
							["boolean", ["feature-state", "active"], false],
							COLORS.CONTAINER,
							COLORS.PRIMARY_10,
						],
					},
				}}
			/>

			{/* Border layer */}
			<Layer
				{...props}
				beforeId={BG_MUNICIPALITIES_LAYER}
				layer={{
					id: MUNICIPALITY_MAP_BORDER,
					type: "line",
					source: MUNICIPALITY_MAP_SOURCE,
					paint: {
						"line-color": COLORS.SECONDARY,
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
