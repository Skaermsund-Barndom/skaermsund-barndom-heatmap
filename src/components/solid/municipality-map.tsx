import { GeoJSONSource } from "@/components/maplibre/geojson-source";
import { Layer } from "@/components/maplibre/layer";
import { ALL_ID, BG_MUNICIPALITIES_LAYER, COLORS } from "@/scripts/const";
import { geojsonSource } from "@/scripts/helpers";
import { store } from "@/scripts/store";
import type { MapProps } from "@/scripts/types";
import type { VoidComponent } from "solid-js";
import { createEffect } from "solid-js";

const MUNICIPALITY_MAP_SOURCE = "municipalities-map";
const MUNICIPALITY_MAP_FILL = "municipalities-map-heatmap";
const MUNICIPALITY_MAP_BORDER = "municipalities-map-border";

interface Props extends MapProps {}

export const MunicipalityMap: VoidComponent<Props> = (props) => {
	createEffect(() => {
		// Store the store value to ensure reactive updates
		const activeId = store.activeMunicipalityId;

		// If no active municipality, don't update the map
		if (!activeId) return;

		// If the map source is not ready, don't update the map
		if (!props.map.getSource(MUNICIPALITY_MAP_SOURCE)) return;

		// Update the map's feature state for the active municipality
		for (const feature of store.municipalitiesMap?.features ?? []) {
			if (!feature.properties?.kommunekod) continue;
			props.map.setFeatureState(
				{
					id: feature.properties.kommunekod,
					source: MUNICIPALITY_MAP_SOURCE,
				},
				{
					active:
						// If no active municipality, set all municipalities to active
						activeId === ALL_ID
						// Or if the municipality is the active municipality, set it to active
						|| feature.properties.kommunekod
							=== activeId?.toString().padStart(4, "0"),
				},
			);
		}
	});

	createEffect(() => {
		// Store the store value to ensure reactive updates
		// If the active region is undefined we still want to update the map
		const activeId = store.activeRegionId;

		// If the map source is not ready, don't update the map
		if (!props.map.getSource(MUNICIPALITY_MAP_SOURCE)) return;

		// Update the map's feature state for the municipalities in the active region
		for (const feature of store.municipalitiesMap?.features ?? []) {
			if (!feature.properties?.kommunekod) continue;
			props.map.setFeatureState(
				{
					id: feature.properties.kommunekod,
					source: MUNICIPALITY_MAP_SOURCE,
				},
				{
					active:
						// If no active region, set all municipalities to active
						activeId === ALL_ID
						// Or if the municipality is in the active region, set it to active
						|| feature.properties?.regionskod === activeId?.toString(),
				},
			);
		}
	});

	// createEffect(() => {
	// 	if (
	// 		store.activeRegionId !== ALL_ID
	// 		|| store.activeMunicipalityId !== ALL_ID
	// 		|| store.activeSchoolId !== ALL_ID
	// 		|| !store.municipalitiesMap
	// 	)
	// 		return;

	// 	const bounds = bbox(store.municipalitiesMap);
	// 	if (bounds.length !== 4) return;

	// 	props.map.fitBounds(bounds, {
	// 		duration: 1000,
	// 		padding: 16,
	// 	});
	// });

	// createEffect(() => {
	// 	const isAllSchools = store.activeSchoolId === ALL_ID;
	// 	if (!store.municipalitiesMap) return;

	// 	// Fly to the active school
	// 	const schoolsCollection = store.schoolsCollection();
	// 	if (!schoolsCollection) return;
	// 	const [lng, lat] = schoolsCollection.features.find(
	// 		(f) => isAllSchools || f.properties.s_id === store.activeSchoolId,
	// 	)?.geometry.coordinates ?? [0, 0];
	// 	if (!lng || !lat) return;
	// 	props.map.flyTo({
	// 		center: [lng, lat],
	// 		duration: 1000,
	// 		zoom: 10,
	// 	});
	// });

	// createEffect(() => {
	// 	const isAllMunicipalities = store.activeMunicipalityId === ALL_ID;
	// 	const isAllRegions = store.activeRegionId === ALL_ID;
	// 	if (!store.municipalitiesMap) return;

	// 	const filteredMunicipalities = store.municipalitiesMap.features.filter(
	// 		(f) =>
	// 			isAllRegions
	// 			|| f.properties.regionskod === store.activeRegionId?.toString()
	// 			|| isAllMunicipalities
	// 			|| f.properties.kommunekod
	// 				=== store.activeMunicipalityId?.toString().padStart(4, "0"),
	// 	);
	// 	const municipalitiesBounds = bbox(
	// 		featureCollection(filteredMunicipalities),
	// 	);
	// 	if (municipalitiesBounds.length === 4) {
	// 		props.map.fitBounds(municipalitiesBounds, {
	// 			duration: 1000,
	// 			padding: 16,
	// 		});
	// 	}
	// });

	// createEffect(() => {
	// 	const isAllRegions = store.activeRegionId === ALL_ID;
	// 	if (!store.municipalitiesMap) return;

	// 	const filteredRegions = store.municipalitiesMap.features.filter(
	// 		(f) =>
	// 			isAllRegions
	// 			|| f.properties.regionskod === store.activeRegionId?.toString(),
	// 	);
	// 	const regionsBounds = bbox(featureCollection(filteredRegions));
	// 	if (regionsBounds.length === 4) {
	// 		props.map.fitBounds(regionsBounds, {
	// 			duration: 1000,
	// 			padding: 16,
	// 		});
	// 	}
	// });

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
