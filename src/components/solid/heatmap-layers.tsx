import { GeoJSONSource } from "@/components/maplibre/geojson-source";
import type { MapProps } from "@/components/maplibre/map-gl";
import { MunicipalityLayers } from "@/components/solid/municipality-layers";
import { RegionLayers } from "@/components/solid/region-layers";
import { SchoolLayers } from "@/components/solid/school-layers";
import { geojsonSource } from "@/scripts/helpers";
import { type VoidComponent, createResource } from "solid-js";

interface Props extends MapProps {}

export const HeatmapLayers: VoidComponent<Props> = (props) => {
	const [source] = createResource(
		async () => {
			const response = await fetch("/api/schools.json");
			const data = await response.json();
			return geojsonSource(data);
		},
		{
			initialValue: geojsonSource(),
		},
	);

	return (
		<GeoJSONSource id="grade-levels" map={props.map} source={source()}>
			<RegionLayers map={props.map} />
			<MunicipalityLayers map={props.map} />
			<SchoolLayers map={props.map} />
		</GeoJSONSource>
	);
};
