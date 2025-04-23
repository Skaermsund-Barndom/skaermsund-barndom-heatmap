import { GeoJSONSource } from "@/components/maplibre/geojson-source";
import { Layer } from "@/components/maplibre/layer";
import type { MapProps } from "@/components/maplibre/map-gl";
import { COLORS } from "@/scripts/const";
import { geojsonSource } from "@/scripts/helpers";
import { type VoidComponent, createResource } from "solid-js";

interface Props extends MapProps {}

export const Regions: VoidComponent<Props> = (props) => {
	const [source] = createResource(
		async () => {
			const response = await fetch("/api/test-classes.json");
			const data = await response.json();
			return geojsonSource(data);
		},
		{
			initialValue: geojsonSource(),
		},
	);

	return (
		<GeoJSONSource id="regions" map={props.map} source={source()}>
			<Layer
				map={props.map}
				layer={{
					id: "grade-levels",
					type: "circle",
					source: "grade-levels",
					paint: {
						"circle-color": COLORS["--color-primary"],
						"circle-radius": ["get", "grade_level"],
					},
				}}
			/>
			<Layer
				map={props.map}
				layer={{
					id: "regions",
					type: "symbol",
					source: "regions",
					layout: {
						"text-field": ["get", "name"],
						"text-font": ["figtree"],
						"text-size": 12,
					},
					paint: {
						"text-color": COLORS["--color-secondary"],
					},
				}}
			/>
		</GeoJSONSource>
	);
};
