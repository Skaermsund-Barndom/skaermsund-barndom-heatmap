import { Control } from "@/components/maplibre/control";
import type { MapProps } from "@/scripts/types";
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
			duration: 300,
		});
	};

	const zoomOut = () => {
		props.map.zoomOut({
			duration: 300,
		});
	};

	return (
		<Control {...props} control={control()} position="bottom-right">
			<div
				ref={element}
				class="zoom-control *:bg-primary *:text-text pointer-events-auto m-1.5 flex gap-1 *:cursor-pointer *:rounded-full"
			>
				<button type="button" class="button" onClick={zoomIn}>
					<svg
						width="32"
						height="32"
						viewBox="0 0 32 32"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<title>Zoom in</title>
						<path
							d="M15.232 20.4476V11.6924H16.7872V20.4476H15.232ZM11.6224 16.8572V15.302H20.3776V16.8572H11.6224Z"
							fill="currentColor"
						/>
					</svg>
				</button>
				<button type="button" class="button" onClick={zoomOut}>
					<svg
						width="32"
						height="32"
						viewBox="0 0 32 32"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<title>Zoom out</title>
						<path
							d="M12.28 16.8416V15.2988H19.72V16.8416H12.28Z"
							fill="currentColor"
						/>
					</svg>
				</button>
			</div>
		</Control>
	);
};
