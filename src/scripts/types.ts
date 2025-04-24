import type { FeatureCollection, Point } from "geojson";
import type { Map as MaplibreMap } from "maplibre-gl";

export interface MapProps {
	map: MaplibreMap;
	beforeId?: string;
}

export interface HeatmapProps extends MapProps {
	schools: SchoolCollection;
}

export interface SchoolProperties {
	school_name: string;
	submissions: number;
}

export type SchoolCollection = FeatureCollection<Point, SchoolProperties>;
