import { setStore, type store } from "@/scripts/store";
import {
	For,
	type Setter,
	type VoidComponent,
	createEffect,
	createMemo,
	createSignal,
} from "solid-js";

interface Item {
	id: number;
	name: string;
	subs: number;
}

interface Props {
	title: string;
	placeholder: string;
	items: Item[];
	disabled?: boolean;
	storeActiveKey: keyof typeof store;
	storeHoverKey: keyof typeof store;
	open: boolean;
	setOpen: Setter<boolean>;
}

export const AccordionList: VoidComponent<Props> = (props) => {
	let parentRef: HTMLDivElement | undefined;

	const [search, setSearch] = createSignal("");

	const filteredItems = createMemo(() => {
		return props.open ?
				props.items.filter((item) =>
					item.name.toLowerCase().includes(search().toLowerCase()),
				)
			:	[];
	});

	createEffect(() => {
		const open = props.open;
		if (!parentRef) return;

		const input = parentRef.querySelector("input[type='text']");
		if (!(input instanceof HTMLInputElement)) return;

		if (open) {
			input.focus();
			input.setSelectionRange(0, input.value.length);
		} else {
			input.blur();
			setSearch("");
		}
	});

	createEffect(() => {
		if (!props.disabled || !parentRef) return;

		const input = parentRef.querySelector("input[type='text']");
		if (!(input instanceof HTMLInputElement)) return;

		input.value = "";
		setStore(props.storeActiveKey, undefined);
		setStore(props.storeHoverKey, undefined);
		setSearch("");
		props.setOpen(false);
	});

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === "ArrowDown") {
			if (!parentRef) return;
			event.preventDefault();

			const firstButton = parentRef.querySelector("ul li button");
			if (!(firstButton instanceof HTMLButtonElement)) return;

			firstButton.focus();
		}

		if (event.key === "Escape") {
			props.setOpen(false);
		}
	};

	const handleSetActiveItem = (item: Item) => {
		if (!parentRef) return;

		const input = parentRef.querySelector("input[type='text']");
		if (!(input instanceof HTMLInputElement)) return;

		input.value = item.name;
		setStore(props.storeActiveKey, item.id);
		setSearch(item.name);
		props.setOpen(false);
	};

	const handleInput = (event: InputEvent) => {
		if (!(event.currentTarget instanceof HTMLInputElement)) return;

		const value = event.currentTarget.value;
		setSearch(value);
		setStore(props.storeActiveKey, undefined);
		setStore(props.storeHoverKey, undefined);
	};

	return (
		<div
			class="bg-primary-10 group overflow-hidden rounded-xl data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
			data-disabled={props.disabled}
			data-open={props.open}
			ref={parentRef}
		>
			<label class="relative grid w-full cursor-pointer grid-cols-2 items-center p-3.5 text-left">
				<input
					type="text"
					placeholder={props.placeholder}
					onInput={handleInput}
					onFocus={() => props.setOpen(true)}
					onKeyDown={handleKeyDown}
					class="pe-2 focus:outline-none"
					tabIndex={props.disabled ? -1 : 0}
				/>
				<div class="flex items-center justify-between gap-2">
					<p class="opacity-0 transition-opacity duration-300 ease-[cubic-bezier(.3,.2,0,1)] group-data-[open=true]:opacity-100">
						Løfter
					</p>
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
				<ul class="h-96 overflow-x-hidden overflow-y-auto">
					<For each={filteredItems()}>
						{(item) => (
							<li class="flex font-light">
								<button
									type="button"
									class="hover:bg-primary focus:bg-primary grid w-full grid-cols-2 p-3.5 text-left focus:outline-none"
									onClick={() => handleSetActiveItem(item)}
									onMouseEnter={() => setStore(props.storeHoverKey, item.id)}
									onMouseLeave={() => setStore(props.storeHoverKey, undefined)}
								>
									<span>{item.name}</span>
									<span>{item.subs}</span>
								</button>
							</li>
						)}
					</For>
				</ul>
			</div>
		</div>
	);
};
