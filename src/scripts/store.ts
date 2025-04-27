import type {
	municipalitiesCollection,
	regionsCollection,
	schoolsCollection,
} from "@/scripts/collections";
import type {
	MunicipalityMapProperties,
	SchoolProperties,
} from "@/scripts/types";
import type { FeatureCollection, MultiPolygon, Point, Polygon } from "geojson";
import { createStore } from "solid-js/store";

export const [store, setStore] = createStore({
	activeSchoolId: undefined as number | undefined,
	activeMunicipalityId: undefined as number | undefined,
	activeRegionId: undefined as number | undefined,
	level: 0 as 0 | 1 | 2,
	municipalitiesMap: undefined as
		| FeatureCollection<Polygon | MultiPolygon, MunicipalityMapProperties>
		| undefined,
	schools: undefined as FeatureCollection<Point, SchoolProperties> | undefined,
	schoolsCollection: (() => undefined) as typeof schoolsCollection,
	regionsCollection: (() => undefined) as typeof regionsCollection,
	municipalitiesCollection: (() =>
		undefined) as typeof municipalitiesCollection,
});

export const [hoverStore, setHoverStore] = createStore({
	schoolId: undefined as number | undefined,
	municipalityId: undefined as number | undefined,
	regionId: undefined as number | undefined,
});
