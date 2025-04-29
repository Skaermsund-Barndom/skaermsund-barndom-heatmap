import type { AppProps } from "@/components/solid/app";
import type { FeatureCollection, Point } from "geojson";
import type { Map as MaplibreMap } from "maplibre-gl";

export interface MapProps extends AppProps {
	map: MaplibreMap;
	beforeId?: string;
}

export interface HeatmapProps extends MapProps {
	schools: SchoolCollection;
}

export interface Item {
	id: number;
	filter: number[];
	name: string;
	subs: number;
}

export interface SchoolProperties extends Item {
	grades: Record<string, number>;
	m_name: string;
	m_id: number;
	r_name: string;
	r_id: number;
}

export interface RegionProperties extends Item {
	r_name: string;
	r_id: number;
}

export interface MunicipalityProperties extends Item {
	m_name: string;
	m_id: number;
	r_name: string;
	r_id: number;
}

export type SchoolCollection = FeatureCollection<Point, SchoolProperties>;

export interface MunicipalityMapProperties {
	"id.namespa": string;
	"id.lokalId": string;
	status: string;
	geometrist: string;
	virkningFr: string;
	virkningTi: string;
	virkningsa: string;
	forretning: string;
	registreri: string;
	registre_1: string;
	registre_2: string;
	forretni_1: string;
	forretni_2: string;
	DAGIid: string | null;
	navn: string;
	redigering: string;
	dataspecif: string;
	landekode: string;
	skala: string;
	udtraeksda: string;
	kommunekod: string;
	LAU1vaerdi: string;
	udenforKom: string;
	regionskod: string;
	regionsLok: string;
	region: string;
}
