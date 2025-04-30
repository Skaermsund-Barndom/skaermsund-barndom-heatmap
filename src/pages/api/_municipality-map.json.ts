import { getMunicipalityMap } from "@/scripts/municipality-map";
import { tryCatch } from "@/scripts/try-catch";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
	const { data, error } = await tryCatch(getMunicipalityMap);

	if (error || !data) {
		return new Response(JSON.stringify({ error }), {
			status: 500,
		});
	}

	return new Response(JSON.stringify(data), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": "public, max-age=31536000",
		},
	});
};
