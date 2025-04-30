import type { AppProps } from "@/components/app";
import { setStore, store } from "@/scripts/store";
import type { Item } from "@/scripts/types";
import type { Feature, Geometry } from "geojson";
import {
	For,
	type VoidComponent,
	createEffect,
	createMemo,
	createSignal,
} from "solid-js";

interface Props extends AppProps {
	placeholder: string;
	features: Feature<Geometry, Item>[];
	disabled?: boolean;
	isOpen: boolean;
	onClickAccordion: () => void;
	onClickItem?: () => void;
}

export const AccordionList: VoidComponent<Props> = (props) => {
	let parentRef: HTMLDivElement | undefined;

	const [search, setSearch] = createSignal("");

	const features = createMemo(() => {
		return props.isOpen ?
				props.features.filter((feature) =>
					feature.properties.name
						.toLowerCase()
						.includes(search().toLowerCase()),
				)
			:	[];
	});

	createEffect(() => {
		const open = props.isOpen;
		if (!parentRef) return;

		const input = parentRef.querySelector("input[type='text']");
		if (!(input instanceof HTMLInputElement)) return;

		if (open) {
			input.focus();
			input.value = "";
		}

		setSearch("");
	});

	createEffect(() => {
		if (!props.disabled || !parentRef) return;

		const input = parentRef.querySelector("input[type='text']");
		if (!(input instanceof HTMLInputElement)) return;

		input.value = "";
		setSearch("");
	});

	createEffect(() => {
		const hoverId = store.hoverId;
		const buttons = parentRef?.querySelectorAll("button");
		if (!buttons) return;

		for (const button of buttons) {
			if (Number(button.dataset.id) === hoverId) {
				button.focus();
			}

			if (!hoverId) {
				button.blur();
			}
		}
	});

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === "ArrowDown") {
			if (!parentRef) return;
			event.preventDefault();

			const firstButton = parentRef.querySelector("ul li button");
			if (!(firstButton instanceof HTMLButtonElement)) return;

			firstButton.focus();
		}
	};

	const handleFocus = () => {
		if (props.isOpen) return;
		props.onClickAccordion();
	};

	const handleSetActiveItem = (properties: Item) => {
		if (!props.onClickItem) return;
		if (!parentRef) return;

		const input = parentRef.querySelector("input[type='text']");
		if (!(input instanceof HTMLInputElement)) return;

		props.onClickItem();
		setStore({
			hoverId: undefined,
			filter: new Set(properties.filter),
		});

		input.value = properties.name;
		setSearch(properties.name);
	};

	const handleInput = (event: InputEvent) => {
		if (!(event.currentTarget instanceof HTMLInputElement)) return;

		const value = event.currentTarget.value;
		setSearch(value);
		setStore({ hoverId: undefined });
	};

	return (
		<div
			class="bg-primary-10 group overflow-hidden rounded-xl data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
			data-disabled={props.disabled}
			data-open={props.isOpen}
			ref={parentRef}
		>
			<label class="relative grid w-full cursor-pointer grid-cols-[2fr_1fr] items-center gap-2 p-3.5 text-left">
				<input
					type="text"
					placeholder={props.placeholder}
					onInput={handleInput}
					onFocus={handleFocus}
					onKeyDown={handleKeyDown}
					class="pe-2 focus:outline-none"
					tabIndex={props.disabled ? -1 : 0}
				/>
				<div class="flex items-center justify-between gap-2">
					<p>{props.isOpen ? "Løfter" : ""}</p>
					<svg
						width="14"
						height="14"
						viewBox="0 0 14 14"
						xmlns="http://www.w3.org/2000/svg"
						class="transition-transform duration-300 ease-[cubic-bezier(.3,.2,0,1)] group-data-[open=true]:rotate-180"
					>
						<title>Toggle</title>
						<path
							d="M7 7.65L3.19 3.84L1.89355 5.1288L7 10.2353L12.1 5.124L10.8184 3.836L7 7.65Z"
							fill="currentColor"
						/>
					</svg>
				</div>
				<div class="border-text absolute -bottom-px left-0 h-px w-full border-t" />
			</label>
			<div class="h-0 overflow-hidden transition-[height] duration-300 ease-[cubic-bezier(.3,.2,0,1)] group-data-[open=true]:h-96">
				<div class="*:hover:bg-primary *:focus:bg-primary *:data-[no-subs=true]:hover:bg-disabled *:data-[no-subs=true]:focus:bg-disabled *:data-[no-subs=true]:text-text/70 h-96 overflow-x-hidden overflow-y-auto font-light *:grid *:w-full *:grid-cols-[2fr_1fr] *:gap-2 *:p-3.5 *:text-left *:focus:outline-none">
					<For each={features()}>
						{({ properties }) => (
							<button
								data-id={properties.id}
								type="button"
								data-no-subs={properties.subs === 0 ? "true" : undefined}
								onClick={() => handleSetActiveItem(properties)}
								onMouseEnter={() => setStore({ hoverId: properties.id })}
								onFocus={() => setStore({ hoverId: properties.id })}
								onMouseLeave={() => setStore({ hoverId: undefined })}
							>
								<span>{properties.name}</span>
								<span>{properties.subs}</span>
							</button>
						)}
					</For>
				</div>
			</div>
		</div>
	);
};
