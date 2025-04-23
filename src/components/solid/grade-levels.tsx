import { GeoJSONSource } from "@/components/maplibre/geojson-source";
import { Layer } from "@/components/maplibre/layer";
import type { MapProps } from "@/components/maplibre/map-gl";
import { geojsonSource } from "@/scripts/helpers";
import { type VoidComponent, createResource } from "solid-js";

interface Props extends MapProps {}

export const GradeLevels: VoidComponent<Props> = (props) => {
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
		<GeoJSONSource id="grade-levels" map={props.map} source={source()}>
			<Layer
				map={props.map}
				layer={{
					id: "grade-levels",
					type: "circle",
					source: "grade-levels",
					paint: {
						"circle-color": "#000000",
						"circle-opacity": 0.5,
						"circle-radius": 10,
					},
				}}
			/>
		</GeoJSONSource>
	);
};
