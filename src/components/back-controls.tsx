import { Control } from "@/components/control";
import { LEVELS } from "@/scripts/const";
import { setStore, store } from "@/scripts/store";
import type { Level, MapProps } from "@/scripts/types";
import type { IControl } from "maplibre-gl";
import { For, type VoidComponent, createSignal, onMount } from "solid-js";

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

	const handleClick = (level: Level) => {
		const filter =
			level.id === "region" ? store.allRegionsIds
			: level.id === "municipality" ? store.allMunicipalitiesIds
			: level.id === "school" ? store.allSchoolsIds
			: new Set<number>();

		setStore({ level, hoverId: undefined, filter });
	};

	return (
		<Control {...props} control={control()} position="top-left">
			<div
				ref={element}
				class="zoom-control text-text pointer-events-auto m-1.5 flex gap-1"
			>
				<For each={LEVELS}>
					{(level) => (
						<button
							type="button"
							class="bg-primary flex items-center gap-1 rounded-full px-3 py-1 transition-opacity duration-300 ease-[cubic-bezier(.3,.2,0,1)] data-[active=false]:cursor-pointer data-[active=false]:opacity-50 data-[active=true]:opacity-100"
							data-active={store.level.id === level.id}
							onClick={() => handleClick(level)}
						>
							{level.name}
						</button>
					)}
				</For>
			</div>
		</Control>
	);
};
