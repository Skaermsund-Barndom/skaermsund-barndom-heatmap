import municipalityCollection from "@/data/kommune-granser--simple.geojson?raw";
import {
	bbox,
	booleanPointInPolygon,
	featureCollection,
	point,
	randomPoint,
} from "@turf/turf";
import type { APIRoute } from "astro";
import type {
	FeatureCollection,
	MultiPolygon,
	Polygon,
	Position,
} from "geojson";

interface MunicipalityProperties {
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
	DAGIid: null;
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

// interface SchoolProperties {
// 	school_name: string;
// 	municipality_name: string;
// 	municipality_code: string;
// 	region_name: string;
// 	region_code: string;
// 	grade_level: number;
// }

const REGIONS = {
	"1081": "Region Nordjylland",
	"1082": "Region Midtjylland",
	"1083": "Region Syddanmark",
	"1084": "Region Hovedstaden",
	"1085": "Region Sjælland",
} as const;

const SCHOOL_NAMES_PREFIX = [
	"Nordre",
	"Søndre",
	"Østre",
	"Vestre",
	"Centrale",
	"Nye",
	"Gamle",
	"Store",
	"Lille",
	"Grønne",
	"Røde",
	"Blå",
	"Gule",
	"Hvide",
	"Sorte",
] as const;

const SCHOOL_NAMES_SUFFIX = [
	"Skole",
	"Privatskole",
	"Friskole",
	"Folkeskole",
	"Grundskole",
	"Byskole",
	"Landsbyskole",
	"Centralskole",
] as const;

function getRandomElement<T>(array: readonly T[]): T {
	if (array.length === 0) {
		throw new Error("Cannot get random element from empty array");
	}
	const index = Math.floor(Math.random() * array.length);
	const element = array[index];
	return element as T;
}

export const GET: APIRoute = async () => {
	const count = 500;
	const features = Array.from(
		{
			length: count,
		},
		() => {
			const { features } = JSON.parse(
				municipalityCollection,
			) as FeatureCollection<Polygon | MultiPolygon, MunicipalityProperties>;
			const municipality = getRandomElement(features);
			const region =
				municipality.properties.regionskod in REGIONS ?
					REGIONS[municipality.properties.regionskod as keyof typeof REGIONS]
				:	"Unknown";
			const properties = {
				school_name: `${getRandomElement(SCHOOL_NAMES_PREFIX)} ${getRandomElement(SCHOOL_NAMES_SUFFIX)}`,
				municipality_name: municipality.properties.navn,
				municipality_code: municipality.properties.kommunekod,
				region_name: region,
				region_code: municipality.properties.regionskod,
				grade_level: Math.floor(Math.random() * 9),
			};

			if (!municipality.geometry) return point([0, 0], properties);

			const bounds = bbox(municipality.geometry);

			let randomCoordinates: Position | undefined;
			let escapeCount = 0;
			do {
				randomCoordinates = randomPoint(1, { bbox: bounds }).features[0]
					?.geometry.coordinates;

				escapeCount++;
				if (escapeCount > 1000) break;
			} while (
				randomCoordinates
				&& !booleanPointInPolygon(randomCoordinates, municipality)
			);

			const feature = point(randomCoordinates ?? [0, 0], properties);
			return feature;
		},
	);

	const FeatureCollection = featureCollection(features);

	return new Response(JSON.stringify(FeatureCollection), {
		headers: {
			"Content-Type": "application/json",
		},
	});
};
