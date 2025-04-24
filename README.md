# Skærmsund Barndom Heatmap

Heatmap for Skærmsund Barndom using Astro, MapLibreGL and Solid.

## Development

1. Clone repo
2. Install dependencies

```sh
bun install
```

3. Run development server

```sh
bun run dev
```

## Building

Run the build command:

```sh
bun run build
```

## Security

If possible apply this Header for serving the website to only show the iframe from certain domains:

```
Content-Security-Policy: frame-ancestors 'self' https://allowed-parent.com
X-Frame-Options: ALLOW-FROM https://allowed-parent.com/
```

## iFrame

Use the iframe like so:

```html
<iframe 
    title="Skærmsund Barndom Heatmap" 
    style="border:none;aspect-ratio:5/4" 
    width="100%" 
    sandbox="allow-scripts"
    src="LINK_TO_DEPLOYED_SITE"
></iframe>
```