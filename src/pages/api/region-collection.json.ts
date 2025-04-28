import { regionCollection } from "@/scripts/collections";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
	const collection = await regionCollection();

	if (!collection) {
		return new Response(JSON.stringify({ error: "No schools found" }), {
			status: 500,
		});
	}

	return new Response(JSON.stringify(collection), {
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": "public, max-age=31536000", // Cache for 1 year since this is static
		},
	});
};
