import { municipalityCollection } from "@/scripts/collections";
import { tryCatch } from "@/scripts/try-catch";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
	const { error, data } = await tryCatch(municipalityCollection);

	if (error) {
		return new Response(JSON.stringify({ error }), {
			status: 500,
		});
	}

	return new Response(JSON.stringify(data), {
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": "public, max-age=31536000", // Cache for 1 year since this is static
		},
	});
};
