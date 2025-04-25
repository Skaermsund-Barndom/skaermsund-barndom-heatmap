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
	r_name: string;
	r_id: number;
	m_name: string;
	m_id: number;
	s_name: string;
	s_id: number;
	subs: number;
}

export type SchoolCollection = FeatureCollection<Point, SchoolProperties>;
