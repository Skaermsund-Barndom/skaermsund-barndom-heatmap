import { store } from "@/scripts/store";
import type { MapProps } from "@/scripts/types";
import { bbox, featureCollection } from "@turf/turf";
import { type VoidComponent, createEffect } from "solid-js";

interface Props extends MapProps {}

export const ZoomHandler: VoidComponent<Props> = (props) => {
	createEffect(() => {
		if (store.activeRegionId) {
			const filteredMap = featureCollection(
				store.municipalitiesMap?.features.filter(
					(f) => f.properties.regionskod === store.activeRegionId?.toString(),
				) ?? [],
			);
			const bounds = bbox(filteredMap);
			if (bounds.length === 4) {
				props.map.fitBounds(bounds, {
					duration: 1000,
					padding: 16,
				});
			}
		}

		if (store.activeMunicipalityId) {
			const filteredMap = featureCollection(
				store.municipalitiesMap?.features.filter(
					(f) =>
						f.properties.kommunekod
						=== store.activeMunicipalityId?.toString().padStart(4, "0"),
				) ?? [],
			);
			const bounds = bbox(filteredMap);
			if (bounds.length === 4) {
				props.map.fitBounds(bounds, {
					duration: 1000,
					padding: 64,
				});
			}
		}

		// if (store.activeSchoolId) {
		// 	const [lng, lat] = store
		// 		.schoolsCollection()
		// 		?.features.find((f) => f.properties.s_id === store.activeSchoolId)
		// 		?.geometry.coordinates ?? [0, 0];
		// 	if (lng && lat) {
		// 		props.map.flyTo({
		// 			center: [lng, lat],
		// 			duration: 1000,
		// 		});
		// 	}
		// }
	});

	return null;
};
