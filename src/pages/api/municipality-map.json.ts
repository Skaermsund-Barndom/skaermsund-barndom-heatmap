import municipalitiesRaw from "@/data/kommune-granser-geojson.json";
import type { APIRoute } from "astro";
import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

export const GET: APIRoute = async () => {
	const DETAIL = "0.004";

	// Create temp directory if it doesn't exist
	const tempDir = join(process.cwd(), ".temp");
	await mkdir(tempDir, { recursive: true });

	// Create temporary input and output files
	const inputPath = join(tempDir, `input-${DETAIL}.json`);
	const outputPath = join(tempDir, `output-${DETAIL}.json`);

	// Write input GeoJSON to temp file
	await writeFile(inputPath, JSON.stringify(municipalitiesRaw));

	// Run mapshaper CLI command
	await new Promise((resolve, reject) => {
		const process = spawn("npx", [
			"mapshaper",
			inputPath,

			"-clean",

			"-simplify",
			"interval=100",
			"visvalingam",
			DETAIL,
			"planar",

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
