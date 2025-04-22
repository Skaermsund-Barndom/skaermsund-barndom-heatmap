import municipalitiesRaw from "@/data/kommune-granser-geojson.json";
import { pipe } from "@/scripts/pipe";
import { feature, featureCollection, truncate } from "@turf/turf";
import type { APIRoute } from "astro";
import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import type { FeatureCollection, MultiPolygon, Polygon } from "geojson";
import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

export const GET: APIRoute = async () => {
	const mapPipeline = pipe(
		simplify({ detail: 1 }),
		removeDecimals({ precision: 3, coordinates: 2, mutate: true }),
		removeProperties(["sovereignt", "sov_a3", "iso_a3"]),
	);

	const municipalities = await mapPipeline(municipalitiesRaw as Municipalities);

	return new Response(JSON.stringify(municipalities), {
		headers: {
			"content-type": "application/json",
			"Cache-Control": "public, max-age=31536000", // Cache for 1 year since this is static
		},
	});
};

type Municipalities = FeatureCollection<
	Polygon | MultiPolygon,
	{
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
>;

export const countries = defineAction({
	input: z.number(),
	handler: async (detail) => {
		const mapPipeline = pipe(
			// filter,
			simplify({ detail }),
			removeDecimals({ precision: 3, coordinates: 2, mutate: true }),
			removeProperties(["sovereignt", "sov_a3", "iso_a3"]),
		);

		const municipalities = await mapPipeline(
			municipalitiesRaw as Municipalities,
		);

		return {
			json: municipalities,
			length: JSON.stringify(municipalities).length,
		};
	},
});

// async function filter({ features }: Countries) {
// 	const { countriesToExclude } = await sanityClient.fetch(COUNTRY_QUERY);
// 	return featureCollection(
// 		features.filter(
// 			(feature) => !countriesToExclude?.includes(feature.properties.sov_a3),
// 		),
// 	);
// }

function simplify(options: { detail: number }) {
	return async (municipalities: Municipalities) => {
		// Create temp directory if it doesn't exist
		const tempDir = join(process.cwd(), ".temp");
		await mkdir(tempDir, { recursive: true });

		// Create temporary input and output files
		const inputPath = join(tempDir, `input-${options.detail}.json`);
		const outputPath = join(tempDir, `output-${options.detail}.json`);

		// Write input GeoJSON to temp file
		await writeFile(inputPath, JSON.stringify(municipalities));

		// Run mapshaper CLI command
		await new Promise((resolve, reject) => {
			const process = spawn("npx", [
				"mapshaper",
				inputPath,
				"-simplify",
				"visvalingam",
				`${options.detail}%`,
				"keep-shapes",
				"-o",
				"format=geojson",
				outputPath,
			]);

			process.on("close", (code) => {
				if (code === 0) {
					resolve(code);
				} else {
					reject(new Error(`Mapshaper process exited with code ${code}`));
				}
			});

			process.on("error", reject);
		});

		// Read and parse the output file
		const output = await readFile(outputPath, "utf-8");

		// delete temp directory
		// await rm(tempDir, { recursive: true, force: true });

		return JSON.parse(output) as Municipalities;
	};
}

function removeDecimals(options: {
	precision?: number;
	coordinates?: number;
	mutate?: boolean;
}) {
	return (municipalities: Municipalities) => truncate(municipalities, options);
}

function removeProperties(keep: string[]) {
	return ({ features }: Municipalities) =>
		featureCollection(
			features.map((f) =>
				feature(
					f.geometry,
					Object.fromEntries(
						Object.entries(f.properties).filter(([key]) => keep.includes(key)),
					),
				),
			),
		);
}
