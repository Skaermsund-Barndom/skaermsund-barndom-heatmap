import { GET as getMunicipalityMap } from "@/pages/api/municipality-map.json";
import { tryCatch } from "@/scripts/try-catch";
import { bbox } from "@turf/turf";
import type { APIRoute } from "astro";

export const GET: APIRoute = async (context) => {
	const { error, data } = await tryCatch(async () => {
		const municipalityMap = await getMunicipalityMap(context);
		return municipalityMap.json();
	});

	if (error || !data) {
		return new Response(JSON.stringify({ error: "No schools found" }), {
			status: 500,
		});
	}

	const initialBounds = bbox(data);

	return new Response(JSON.stringify(initialBounds), {
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": "public, max-age=31536000", // Cache for 1 year since this is static
		},
	});
};
