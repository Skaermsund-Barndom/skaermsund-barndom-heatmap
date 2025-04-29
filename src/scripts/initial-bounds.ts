import { municipalityMapCollectionPromise } from "@/scripts/municipality-map";
import { tryCatch } from "@/scripts/try-catch";
import { bbox } from "@turf/turf";

export async function initialBounds() {
	const { error, data } = await tryCatch(municipalityMapCollectionPromise);

	console.log(data);

	if (error) {
		return undefined;
	}

	return bbox(data);
}
