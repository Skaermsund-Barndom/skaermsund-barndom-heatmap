import solidJs from "@astrojs/solid-js";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	build: {
		inlineStylesheets: "always",
	},
	integrations: [solidJs()],
	vite: {
		plugins: [tailwindcss()],
	},
});
