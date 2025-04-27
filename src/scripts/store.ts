import type {
	municipalitiesCollection,
	regionsCollection,
} from "@/scripts/collections";
import type {
	MunicipalityMapProperties,
	SchoolProperties,
} from "@/scripts/types";
import type { FeatureCollection, MultiPolygon, Point, Polygon } from "geojson";
import { createStore } from "solid-js/store";

export const [store, setStore] = createStore({
	activeSchoolId: undefined as number | undefined,
	hoverSchoolId: undefined as number | undefined,
	activeMunicipalityId: undefined as number | undefined,
	hoverMunicipalityId: undefined as number | undefined,
	activeRegionId: undefined as number | undefined,
	hoverRegionId: undefined as number | undefined,
	backTitle: "Tilbage",
	municipalitiesMap: undefined as
		| FeatureCollection<Polygon | MultiPolygon, MunicipalityMapProperties>
		| undefined,
	schools: undefined as FeatureCollection<Point, SchoolProperties> | undefined,
	regionsCollection: undefined as
		| ReturnType<typeof regionsCollection>
		| undefined,
	municipalitiesCollection: undefined as
		| ReturnType<typeof municipalitiesCollection>
		| undefined,
});
