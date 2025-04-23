import { tryCatch } from "@/scripts/try-catch";
import { featureCollection, point } from "@turf/turf";
import Airtable from "airtable";
import type { APIRoute } from "astro";

const SUBMISSIONS = "skole-class-fn Rollup (from Submissions 2)";
const INSTITUTION_NAME = "INST_NAVN";
const LATITUDE = "GEO_BREDDE_GRAD";
const LONGITUDE = "GEO_LAENGDE_GRAD";

const MIN_LAT = 54.54105080166195;
const MAX_LAT = 57.770218411476634;
const MIN_LNG = 8.052716042949726;
const MAX_LNG = 15.210410477270017;

const base = new Airtable({ apiKey: import.meta.env.AIRTABLE_API_KEY }).base(
	"appFpQHfnl4TDWh4c",
);

export const GET: APIRoute = async () => {
	const schools: GeoJSON.FeatureCollection = featureCollection([]);

	let count = 0;
	count = 0;

	const { error } = await tryCatch(
		new Promise<boolean>((resolve, reject) => {
			base("Schools")
				.select({
					view: "Grid view",
				})
				.eachPage(
					(records, processNextPage) => {
						// This function (`page`) will get called for each page of records.
						for (const record of records) {
							const submissions = Number(record.get(SUBMISSIONS));

							if (Number.isNaN(submissions) || submissions === 0) {
								continue;
							}

							const lng = fixGeo(Number(record.get(LONGITUDE)), [
								MIN_LNG,
								MAX_LNG,
							]);
							const lat = fixGeo(Number(record.get(LATITUDE)), [
								MIN_LAT,
								MAX_LAT,
							]);

							if (Number.isNaN(lng) || Number.isNaN(lat)) {
								continue;
							}

							const feature = point([lng, lat], {
								school_name: record.get(INSTITUTION_NAME),
								submissions,
							});

							schools.features.push(feature);
						}

						// To fetch the next page of records, call `processNextPage`.
						// If there are more records, `page` will get called again.
						// If there are no more records, `done` will get called.
						processNextPage();
					},
					(err) => {
						if (err) {
							console.error(err);
							reject(err);
							return;
						}

						resolve(true);
					},
				);
		}),
	);

	if (error) {
		console.error(error);
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
		});
	}

	return new Response(JSON.stringify(schools), {
		headers: {
			"Content-Type": "application/json",
			"Cache-Control": "public, max-age=31536000", // Cache for 1 year since this is static
		},
	});
};

/**
 * Because the geo data is stored in a weird way we need this odd function to fix it.
 * The latitude and longitude are stored as integer values and the length of the integer varies.
 * The solution I came up with is to continue dividing the number by 10 until it's within the approximate range of Denmarks bounding box.
 * If the number falls out of the range, we return NaN.
 * Very not good solution, but it works I guess.
 */
const fixGeo = (value: number, [min, max]: [number, number]) => {
	let fixed = value;

	while (fixed > max && !Number.isNaN(fixed)) {
		fixed = fixed / 10;
	}

	if (fixed < min) {
		fixed = Number.NaN;
	}

	return truncate(fixed, 5);
};

const truncate = (value: number, decimals: number) => {
	return Math.round(value * 10 ** decimals) / 10 ** decimals;
};
