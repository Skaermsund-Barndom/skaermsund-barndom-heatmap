import type { MapProps } from "@/scripts/types";
import type {
	GeoJSONSourceSpecification,
	GeoJSONSource as MaplibreGeoJSONSource,
} from "maplibre-gl";
import { type ParentComponent, createEffect, onCleanup } from "solid-js";

interface Props extends MapProps {
	id: string;
	source: GeoJSONSourceSpecification;
}

export const GeoJSONSource: ParentComponent<Props> = (props) => {
	createEffect<Props>((previousProps) => {
		if (previousProps.id !== props.id) {
			if (props.map.getSource(previousProps.id)) {
				props.map.removeSource(previousProps.id);
			}
		} else {
			const existingSource = props.map.getSource<MaplibreGeoJSONSource>(
				props.id,
			);
			if (existingSource) {
				existingSource.setData(props.source.data);

				return props;
			}
		}

		props.map.addSource(props.id, props.source);

		return props;
	}, props);

	onCleanup(() => {
		if (props.map.getSource(props.id)) {
			props.map.removeSource(props.id);
		}
	});

	return <>{props.children}</>;
};
