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

export function geojsonSource(data?: GeoJSON.GeoJSON) {
	return {
		type: "geojson",
		data: data ?? {
			type: "FeatureCollection",
			features: [],
		},
	} satisfies GeoJSONSourceSpecification;
}
