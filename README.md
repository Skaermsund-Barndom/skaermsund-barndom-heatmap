# Skærmsund Barndom Heatmap

Heatmap for Skærmsund Barndom using Astro, MapLibreGL and Solid.

## Usage

Use the iframe in custom code like so:

```html
<div class="heatmap-embed">
    <style>
        .heatmap-embed {
            container-type: inline-size;
        }
        .heatmap-embed iframe {
            border: none;
            aspect-ratio: 16/9;
        }
        @container (max-width: 48rem) {
            .heatmap-embed iframe {
                aspect-ratio: 1/1;
            }
        }
    </style>
    <iframe
        title="Skærmsund Barndom Heatmap"
        width="100%"
        sandbox="allow-scripts allow-same-origin"
        <!-- link to heatmap that you host -->
        src="https://skaermsund-barndom-heatmap-test-1.netlify.app" 
    >
    </iframe>
</div>
```

## Deploy

1. Deploy to this GitHub repo to Netlify.
2. Use the standard settings for Astro as recommended by Netlify.
3. Add a new build hook in "Site configuration" -> "Build & deploy" -> "Build hooks"
4. Update the action secret with the build hook in the GitHub repo in "Settings" -> "Secrets and variables" -> "Actions" -> "Secrets" -> "Repository secrets" -> "NETLIFY_BUILD_HOOK_URL"
5. Check the connection by running the "Trigger Netlify Build" action in the "Actions" tab in the GitHub repo to see if Netlify start the new build.

## Development

Clone repo and make sure you have Bun installed then

```sh
bun install
bun run dev
```

## Commands

```
# to build the project for production (includes type checking)
bun run build

# to run type checking
bun run check

# to start the development server
bun run dev

# to preview the production build locally
bun run preview

# to remove dependencies and reinstall cleanly
bun run reinstall

# to check for and update dependencies interactively
bun run update:deps
```
