import type { AppProps } from "@/components/app";
import type {
	getMunicipalityCollection,
	getRegionCollection,
	getSchoolCollection,
} from "@/scripts/collections";
import type { getMunicipalityMap } from "@/scripts/municipality-map";
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
	filter?: number[];
	name: string;
	subs: number;
}

/**
 * A record of a grade.
 */
export type Grades = Record<string, number>;

/**
 * A record of a school.
 */
export interface School {
	/** The id of the school */
	id: number;
	/** The name of the school */
	name: string;
	/** The grades of the school */
	grades: Grades;
	/** The number of submissions of the school */
	subs: number;
	/** The coordinates of the school */
	coord: [number, number];
	/** The name of the municipality */
	m_name: string;
	/** The id of the municipality */
	m_id: number;
	/** The name of the region */
	r_name: string;
	/** The id of the region */
	r_id: number;
}

/**
 * A record of a submission.
 */
export type Submissions = Record<string, number>;

export interface SchoolProperties extends Item {
	grades: Grades;
	m_name: string;
	m_id: number;
	r_name: string;
	r_id: number;
}

export interface RegionProperties extends Item {}
export interface MunicipalityProperties extends Item {}

export type SchoolCollection = Awaited<ReturnType<typeof getSchoolCollection>>;
export type MunicipalityCollection = Awaited<
	ReturnType<typeof getMunicipalityCollection>
>;
export type RegionCollection = Awaited<ReturnType<typeof getRegionCollection>>;
export type MunicipalityMap = Awaited<ReturnType<typeof getMunicipalityMap>>;

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
