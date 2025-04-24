import {
	type MapEventType,
	type MapOptions,
	Map as MaplibreMap,
} from "maplibre-gl";
import {
	type ParentComponent,
	createEffect,
	createSignal,
	onCleanup,
} from "solid-js";

export type MapEvents = {
	[K in keyof MapEventType]?: (event: MapEventType[K]) => void;
};

interface Props {
	mapOptions?: Partial<MapOptions>;
	events?: MapEvents;
}

export const MapGL: ParentComponent<Props> = (props) => {
	let container: HTMLDivElement | undefined;

	const [map, setMap] = createSignal<MaplibreMap>();

	createEffect(() => {
		if (!container) return;

		setMap(
			new MaplibreMap({
				...props.mapOptions,
				container,
			}),
		);
	});

	onCleanup(() => {
		map()?.remove();
	});

	createEffect(() => {
		if (!props.events) return;

		const entries = Object.entries(props.events) as [
			keyof MapEventType,
			(event: MapEventType[keyof MapEventType]) => void,
		][];

		for (const [event, listener] of entries) {
			map()?.on(event, listener);
		}

		onCleanup(() => {
			for (const [event, listener] of entries) {
				map()?.off(event, listener);
			}
		});
	});

	return (
		<>
			<div id="maplibregl" class="h-full w-full" ref={container} />
			{props.children}
		</>
	);
};
