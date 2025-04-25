import { getMunicipalityMap } from "@/scripts/municipality-map";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
	const output = await getMunicipalityMap();

	return new Response(JSON.stringify(output), {
		headers: {
			"content-type": "application/json",
			"Cache-Control": "public, max-age=31536000", // Cache for 1 year since this is static
		},
	});
};
