import { Control } from "@/components/maplibre/control";
import type { MapProps } from "@/components/maplibre/map-gl";
import type { IControl } from "maplibre-gl";
import { type VoidComponent, createSignal, onMount } from "solid-js";

class ZoomControl implements IControl {
	private _container: HTMLElement;

	constructor(element: HTMLElement) {
		this._container = element;
	}

	onAdd() {
		return this._container;
	}

	onRemove() {
		this._container?.parentNode?.removeChild(this._container);
	}
}

interface Props extends MapProps {}

export const ZoomControls: VoidComponent<Props> = (props) => {
	let element: HTMLDivElement | undefined;

	const [control, setControl] = createSignal<ZoomControl>();

	onMount(() => {
		if (!element) return;
		setControl(new ZoomControl(element));
	});

	const zoomIn = () => {
		props.map.zoomIn({
			duration: 0,
		});
	};

	const zoomOut = () => {
		props.map.zoomOut({
			duration: 0,
		});
	};

	return (
		<Control map={props.map} control={control()} position="bottom-right">
			<div ref={element} class="zoom-control">
				<button type="button" class="button" onClick={zoomIn}>
					+
				</button>
				<button type="button" class="button" onClick={zoomOut}>
					–
				</button>
			</div>
		</Control>
	);
};
