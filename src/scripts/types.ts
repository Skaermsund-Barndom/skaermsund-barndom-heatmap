import type { AppProps } from "@/components/app";
import type {
	getMunicipalityCollection,
	getRegionCollection,
	getSchoolCollection,
} from "@/scripts/collections";
import type { getMunicipalityMap } from "@/scripts/municipality-map";
import type { Map as MaplibreMap } from "maplibre-gl";

/**
 * The properties of all map components.
 */
export interface MapProps extends AppProps {
	/** The maplibre map instance */
	map: MaplibreMap;
	/** Optional id of the layer to place this layer before */
	beforeId?: string;
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

/**
 * The base properties of a region, municipality or school.
 */
export interface BaseProperties {
	id: number;
	filter?: number[];
	name: string;
	subs: number;
}

/**
 * The properties of a school.
 */
export interface SchoolProperties extends BaseProperties {
	grades: Grades;
	m_name: string;
	m_id: number;
	r_name: string;
	r_id: number;
}

/**
 * The properties of a region.
 */
export interface RegionProperties extends BaseProperties {}

/**
 * The properties of a municipality.
 */
export interface MunicipalityProperties extends BaseProperties {}

/**
 * A level (region, municipality or school).
 */
export interface Level {
	id: string;
	name: string;
}

/**
 * Feature collection of schools.
 */
export type SchoolCollection = Awaited<ReturnType<typeof getSchoolCollection>>;

/**
 * Feature collection of municipalities.
 */
export type MunicipalityCollection = Awaited<
	ReturnType<typeof getMunicipalityCollection>
>;

/**
 * Feature collection of regions.
 */
export type RegionCollection = Awaited<ReturnType<typeof getRegionCollection>>;

/**
 * Feature collection of municipalities in the municipality map.
 */
export type MunicipalityMap = Awaited<ReturnType<typeof getMunicipalityMap>>;

/**
 * The properties of a municipality in the municipality map.
 */
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
	/** The id of the municipality as a string always 4 characters long */
	kommunekod: string;
	LAU1vaerdi: string;
	udenforKom: string;
	/** The id of the region as a string always 4 characters long */
	regionskod: string;
	regionsLok: string;
	region: string;
}
