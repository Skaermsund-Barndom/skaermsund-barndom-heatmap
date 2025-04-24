import { MunicipalityLayers } from "@/components/solid/municipality-layers";
import { RegionLayers } from "@/components/solid/region-layers";
import { SchoolLayers } from "@/components/solid/school-layers";
import type { MapProps, SchoolCollection } from "@/scripts/types";
import type { DataDrivenPropertyValueSpecification } from "maplibre-gl";
import { Show, type VoidComponent, createResource } from "solid-js";

interface Props extends MapProps {}

export const HeatmapLayers: VoidComponent<Props> = (props) => {
	const [schools] = createResource<SchoolCollection>(async () => {
		const response = await fetch("/api/schools.json");
		const data = await response.json();
		console.log(data);
		return data;
	});

	return (
		<Show when={schools()}>
			{(schools) => (
				<>
					<RegionLayers map={props.map} schools={schools()} />
					<MunicipalityLayers map={props.map} schools={schools()} />
					<SchoolLayers map={props.map} schools={schools()} />
				</>
			)}
		</Show>
	);
};

export const hoverOpacity: DataDrivenPropertyValueSpecification<number> = [
	"case",
	["boolean", ["feature-state", "hover"], false],
	1,
	0,
];
