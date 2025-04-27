import { Control } from "@/components/maplibre/control";
import { LEVELS } from "@/scripts/const";
import { setStore, store } from "@/scripts/store";
import type { MapProps } from "@/scripts/types";
import type { IControl } from "maplibre-gl";
import { type VoidComponent, createSignal, onMount } from "solid-js";

class BackControl implements IControl {
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

export const BackControls: VoidComponent<Props> = (props) => {
	let element: HTMLDivElement | undefined;

	const [control, setControl] = createSignal<BackControl>();

	onMount(() => {
		if (!element) return;
		setControl(new BackControl(element));
	});

	const handleBack = () => {
		setStore(
			"level",
			store.level === 2 ? 1
			: store.level === 1 ? 0
			: 0,
		);
	};

	return (
		<Control map={props.map} control={control()} position="top-left">
			<div
				ref={element}
				class="zoom-control *:bg-primary *:text-text pointer-events-auto m-1.5 flex gap-1 *:cursor-pointer *:rounded-full"
			>
				<button
					type="button"
					class="flex items-center gap-1 px-2 py-1 transition-opacity duration-300 ease-[cubic-bezier(.3,.2,0,1)] data-[visible=false]:opacity-0 data-[visible=true]:opacity-100"
					data-visible={!!LEVELS[store.level].backTitle}
					onClick={handleBack}
				>
					<svg
						width="14"
						height="14"
						viewBox="0 0 14 14"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<title>Back</title>
						<path
							d="M6.35 7L10.16 3.19L8.87114 1.89355L3.76464 7L8.87594 12.1L10.1639 10.8184L6.35 7Z"
							fill="currentColor"
						/>
					</svg>
					<span>{LEVELS[store.level].backTitle}</span>
				</button>
			</div>
		</Control>
	);
};
