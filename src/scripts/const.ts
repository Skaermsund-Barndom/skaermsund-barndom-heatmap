export const INITIAL_ZOOM = 3;
export const MIN_ZOOM = 4;
export const MAX_ZOOM = 10;

export const FONT_STACK = ["Figtree Light"];

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const OG_IMAGE_FORMAT = "jpg";
export const OG_IMAGE_MIME_TYPE = `image/${OG_IMAGE_FORMAT}`;
export const OG_IMAGE_QUALITY = 90;
export const OG_IMAGE_PATH = "/api/images/og-image.jpg";

export const TOP_LAYER = "top-layer";
export const BOTTOM_LAYER = "bottom-layer";
export const BG_MUNICIPALITIES_LAYER = "municipalities-background-layer";
export const BG_GRADE_LEVELS_LAYER = "grade-levels-background-layer";
export const BG_LAYER = "background-layer";

export const COLORS = {
	"--color-container": "#fafafa",
	"--color-text": "#2b2b2b",
	"--color-primary-10": "#d7f1e5",
	"--color-primary-20": "#bce8d3",
	"--color-primary-30": "#9bddbd",
	"--color-primary-40": "#7ad1a7",
	"--color-primary-50": "#58c691",
	"--color-primary": "#37ba7b",
	"--color-primary-60": "#2e9b67",
	"--color-primary-70": "#257c52",
	"--color-primary-80": "#1c5d3e",
	"--color-primary-90": "#123e29",
	"--color-primary-100": "#0b2519",
	"--color-secondary": "#02321c",
	"--color-tertiary": "#02321c",
};

export const LEVELS = [
	{
		id: "region",
		name: "Region",
		backTitle: "",
	},
	{
		id: "municipality",
		name: "Kommune",
		backTitle: "Regioner",
	},
	{
		id: "school",
		name: "Skole",
		backTitle: "Kommuner",
	},
] as const;

export const ZOOM_LEVELS = {
	REGION: 0,
	MUNICIPALITY: 8,
	SCHOOL: 10,
	MAX: 24,
} as const;
