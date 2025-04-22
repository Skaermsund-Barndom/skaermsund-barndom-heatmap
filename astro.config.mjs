import solidJs from "@astrojs/solid-js";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	server: {
		port: 7474,
	},
	output: "static",
	site: "https://skaermsund-barndom-heatmap.netlify.app/",
	integrations: [
		solidJs(),
	],
	
});
