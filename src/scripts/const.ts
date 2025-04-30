export const INITIAL_ZOOM = 3;
export const MIN_ZOOM = 4;
export const MAX_ZOOM = 10;

export const FONT_STACK = ["Figtree Light"];

export const TOP_LAYER = "top-layer";
export const BOTTOM_LAYER = "bottom-layer";
export const BG_MUNICIPALITIES_LAYER = "municipalities-background-layer";
export const BG_HEATMAP_LEVELS_LAYER = "grade-levels-background-layer";
export const BG_LAYER = "background-layer";

export const COLORS = {
	CONTAINER: "#fafafa",
	TEXT: "#2b2b2b",
	DISABLED: "#CCCCCC",
	PRIMARY_10: "#d7f1e5",
	PRIMARY_20: "#bce8d3",
	PRIMARY_30: "#9bddbd",
	PRIMARY_40: "#7ad1a7",
	PRIMARY_50: "#58c691",
	PRIMARY: "#37ba7b",
	PRIMARY_60: "#2e9b67",
	PRIMARY_70: "#257c52",
	PRIMARY_80: "#1c5d3e",
	PRIMARY_90: "#123e29",
	PRIMARY_100: "#0b2519",
	SECONDARY: "#02321c",
	TERTIARY: "#02321c",
};

export const LEVELS = [
	{
		id: "region",
		name: "Regioner",
		backTitle: "",
	},
	{
		id: "municipality",
		name: "Kommuner",
		backTitle: "Regioner",
	},
	{
		id: "school",
		name: "Skoler",
		backTitle: "Kommuner",
	},
] as const;
