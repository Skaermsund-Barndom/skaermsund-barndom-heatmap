import type {
	MunicipalityCollection,
	RegionCollection,
	SchoolCollection,
} from "@/scripts/types";
import type { FeatureCollection } from "geojson";
import type { GeoJSONSourceSpecification } from "maplibre-gl";

/**
 * Returns the maximum of the client width or the window width.
 * @returns The maximum of the client width or the window width.
 */
export function vw() {
	return typeof window !== "undefined" ?
			Math.max(
				document.documentElement.clientWidth || 0,
				window.innerWidth || 0,
			)
		:	0;
}

/**
 * Returns the maximum of the client width or the window width.
 * @returns The maximum of the client width or the window width.
 */
export function vh() {
	return typeof window !== "undefined" ?
			Math.max(
				document.documentElement.clientHeight || 0,
				window.innerHeight || 0,
			)
		:	0;
}

/**
 * Converts a pixel value to rem.
 * @param px - The pixel value to convert.
 * @returns The converted value in rem.
 */
export function pxToRem(px: number) {
	return typeof document !== "undefined" ?
			px
				/ Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
		:	px / 16;
}

/**
 * Converts a rem value to pixels.
 * @param rem - The rem value to convert.
 * @returns The converted value in pixels.
 */
export function remToPx(rem: number) {
	return typeof document !== "undefined" ?
			rem
				* Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
		:	rem * 16;
}

/**
 * Creates a geojson source with type inference.
 * @param data - The data to create the source from.
 * @param promoteId - The id to promote.
 * @returns The geojson source.
 */
export function geojsonSource<F extends FeatureCollection>(
	data?: F,
	promoteId?: keyof F["features"][number]["properties"],
) {
	return {
		type: "geojson",
		data: data ?? {
			type: "FeatureCollection",
			features: [],
		},
		promoteId: typeof promoteId === "string" ? promoteId : undefined,
	} satisfies GeoJSONSourceSpecification;
}

/**
 * Maps a value from one range to another.
 * @param value - The value to map.
 * @param input1 - The start of the first range.
 * @param input2 - The start of the second range.
 * @param output1 - The end of the first range.
 * @param output2 - The end of the second range.
 * @returns The mapped value.
 */
export function interpolate(
	value: number,
	input1: number,
	input2: number,
	output1: number,
	output2: number,
) {
	return ((value - input1) * (output2 - input2)) / (output1 - input1) + input2;
}

export function allIds(
	collection?: RegionCollection | MunicipalityCollection | SchoolCollection,
) {
	return collection?.features.map((f) => f.properties.id) ?? [];
}

export function allSubs(collection?: SchoolCollection) {
	return (
		collection?.features.reduce((acc, f) => acc + f.properties.subs, 0) ?? 0
	);
}
