import { GeoJSONSource } from "@/components/maplibre/geojson-source";
import { Layer } from "@/components/maplibre/layer";
import type { MapProps } from "@/components/maplibre/map-gl";
import { COLORS } from "@/scripts/const";
import { geojsonSource } from "@/scripts/helpers";
import type { GeoJSONSourceSpecification } from "maplibre-gl";
import type { VoidComponent } from "solid-js";
import { createResource } from "solid-js";

interface Props extends MapProps {
	beforeId?: string;
}

export const Municipalities: VoidComponent<Props> = (props) => {
	const [municipalities] = createResource<GeoJSONSourceSpecification>(
		async () => {
			const response = await fetch("/api/municipalities.geojson");
			const data = await response.json();
			return geojsonSource(data);
		},
		{
			initialValue: geojsonSource(),
		},
	);

	return (
		<GeoJSONSource
			id="municipalities"
			map={props.map}
			source={municipalities()}
		>
			<Layer
				beforeId={props.beforeId}
				map={props.map}
				layer={{
					id: "municipalities-heatmap",
					type: "fill",
					source: "municipalities",
					paint: {
						"fill-color": COLORS["--color-primary-10"],
					},
				}}
			/>
			<Layer
				beforeId={props.beforeId}
				map={props.map}
				layer={{
					id: "municipalities-border",
					type: "line",
					source: "municipalities",
					paint: {
						"line-color": COLORS["--color-secondary"],
						"line-width": 1,
					},
					layout: {
						"line-cap": "round",
						"line-join": "round",
					},
				}}
			/>
		</GeoJSONSource>
	);
};
