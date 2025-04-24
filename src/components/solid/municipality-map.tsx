import { GeoJSONSource } from "@/components/maplibre/geojson-source";
import { Layer } from "@/components/maplibre/layer";
import { COLORS } from "@/scripts/const";
import { geojsonSource } from "@/scripts/helpers";
import type { MapProps } from "@/scripts/types";
import type { GeoJSONSourceSpecification } from "maplibre-gl";
import type { VoidComponent } from "solid-js";
import { createResource } from "solid-js";

const MUNICIPALITY_MAP_SOURCE = "municipalities-map";
const MUNICIPALITY_MAP_HEATMAP_LAYER = "municipalities-map-heatmap";
const MUNICIPALITY_MAP_BORDER_LAYER = "municipalities-map-border";

interface Props extends MapProps {
	beforeId?: string;
}

export const MunicipalityMap: VoidComponent<Props> = (props) => {
	const [source] = createResource<GeoJSONSourceSpecification>(
		async () => {
			const response = await fetch("/api/municipality-map.geojson");
			const data = await response.json();
			return geojsonSource(data);
		},
		{
			initialValue: geojsonSource(),
		},
	);

	return (
		<GeoJSONSource
			id={MUNICIPALITY_MAP_SOURCE}
			map={props.map}
			source={source()}
		>
			<Layer
				beforeId={props.beforeId}
				map={props.map}
				layer={{
					id: MUNICIPALITY_MAP_HEATMAP_LAYER,
					type: "fill",
					source: MUNICIPALITY_MAP_SOURCE,
					paint: {
						"fill-color": COLORS["--color-primary-10"],
					},
				}}
			/>
			<Layer
				beforeId={props.beforeId}
				map={props.map}
				layer={{
					id: MUNICIPALITY_MAP_BORDER_LAYER,
					type: "line",
					source: MUNICIPALITY_MAP_SOURCE,
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
