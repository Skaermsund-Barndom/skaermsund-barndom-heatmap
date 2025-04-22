import municipalitiesRaw from "@/data/kommune-granser-geojson.json";
import type { APIRoute } from "astro";
import type { FeatureCollection, MultiPolygon, Polygon } from "geojson";
import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

export const GET: APIRoute = async () => {
	const detail = "0.01";

	// Create temp directory if it doesn't exist
	const tempDir = join(process.cwd(), ".temp");
	await mkdir(tempDir, { recursive: true });

	// Create temporary input and output files
	const inputPath = join(tempDir, `input-${detail}.json`);
	const outputPath = join(tempDir, `output-${detail}.json`);

	// Write input GeoJSON to temp file
	await writeFile(inputPath, JSON.stringify(municipalitiesRaw));

	// Run mapshaper CLI command
	await new Promise((resolve, reject) => {
		const process = spawn("bunx", [
			"mapshaper",
			inputPath,

			"-clean",

			"-simplify",
			"interval=100",
			"visvalingam",
			detail,
			// "keep-shapes",
			// "weighting=0",

			"-o",
			"precision=0.001",
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

	return new Response(output, {
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

async function simplify(municipalities: Municipalities) {
	const detail = "0.01";

	// Create temp directory if it doesn't exist
	const tempDir = join(process.cwd(), ".temp");
	await mkdir(tempDir, { recursive: true });

	// Create temporary input and output files
	const inputPath = join(tempDir, `input-${detail}.json`);
	const outputPath = join(tempDir, `output-${detail}.json`);

	// Write input GeoJSON to temp file
	await writeFile(inputPath, JSON.stringify(municipalities));

	// Run mapshaper CLI command
	await new Promise((resolve, reject) => {
		const process = spawn("npx", [
			"mapshaper",
			inputPath,

			"-clean",

			"-simplify",
			"interval=100",
			"visvalingam",
			detail,
			// "keep-shapes",
			// "weighting=0",

			"-o",
			"precision=0.001",
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
}
