import type {
	municipalitiesCollection,
	regionsCollection,
	schoolsCollection,
} from "@/scripts/collections";
import { ALL_ID } from "@/scripts/const";
import type {
	MunicipalityMapProperties,
	SchoolProperties,
} from "@/scripts/types";
import type { FeatureCollection, MultiPolygon, Point, Polygon } from "geojson";
import { createStore } from "solid-js/store";

export const [store, setStore] = createStore({
	activeSchoolId: ALL_ID,
	activeMunicipalityId: ALL_ID,
	activeRegionId: ALL_ID,
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
	schoolId: ALL_ID,
	municipalityId: ALL_ID,
	regionId: ALL_ID,
});
