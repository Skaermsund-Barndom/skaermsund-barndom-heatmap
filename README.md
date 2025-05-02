# Skærmsund Barndom Heatmap

Heatmap for Skærmsund Barndom using Astro, MapLibreGL and Solid.

## Usage

Use the iframe in custom code like so:

```html
<div class="heatmap-embed">
    <style>
        .heatmap-embed {
            container-type: inline-size;
            max-width: 90em;
            margin: 0 auto;
            padding: 0 2rem 0 0;
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
        src="https://beamish-moxie-da5c0d.netlify.app" 
    >
    </iframe>
</div>
```

And here is the HTML for the form:

```html
<div class="form-embed">
    <style>
        .form-embed {
            container-type: inline-size;
        }
        .form-embed iframe {
            border: none;
        }
        @container (max-width: 48rem) {
            .form-embed iframe {
                aspect-ratio: 1/1;
            }
        }
    </style>
    <iframe class="airtable-embed" src="https://airtable.com/embed/appFpQHfnl4TDWh4c/pagdW3cx1Iroep5uO/form" frameborder="0" onmousewheel="" width="100%" height="533" style="background: transparent; border: 1px solid #ccc;"></iframe>
</div>
```

## Deploy

1. Netlify: Deploy to this GitHub repo with the recommended settings for Astro.
3. Netlify: Add a new build hook in "Site configuration" -> "Build & deploy" -> "Build hooks"
4. Github: Update the action secret with the build hook in "Settings" -> "Secrets and variables" -> "Actions" -> "Secrets" -> "Repository secrets" -> "NETLIFY_BUILD_HOOK_URL"
5. Github: Check the connection by running the "Trigger Netlify Build" action in the "Actions" tab in the GitHub repo to see if Netlify start the new build.
6. Squarespace: Use the iframe code from above in a custom code block.

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
