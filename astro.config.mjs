import solidJs from "@astrojs/solid-js";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

// https://astro.build/config
export default defineConfig({
	experimental: {
		fonts: [
			{
				provider: fontProviders.google(),
				name: "Figtree",
				cssVariable: "--font-figtree",
			},
		],
	},
	integrations: [solidJs()],
	vite: {
		plugins: [tailwindcss()],
	},
});
