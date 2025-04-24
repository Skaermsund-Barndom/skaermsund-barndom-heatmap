import type { FeatureCollection } from "geojson";
import type { GeoJSONSourceSpecification } from "maplibre-gl";

export function vw() {
	return typeof window !== "undefined" ?
			Math.max(
				document.documentElement.clientWidth || 0,
				window.innerWidth || 0,
			)
		:	0;
}

export function vh() {
	return typeof window !== "undefined" ?
			Math.max(
				document.documentElement.clientHeight || 0,
				window.innerHeight || 0,
			)
		:	0;
}

export function pxToRem(px: number) {
	return typeof document !== "undefined" ?
			px
				/ Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
		:	px / 16;
}

export function remToPx(rem: number) {
	return typeof document !== "undefined" ?
			rem
				* Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
		:	rem * 16;
}

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
 * @param x1 - The start of the first range.
 * @param y1 - The end of the first range.
 * @param x2 - The start of the second range.
 * @param y2 - The end of the second range.
 * @returns The mapped value.
 */
export function interpolate(
	value: number,
	x1: number,
	y1: number,
	x2: number,
	y2: number,
) {
	return ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;
}
