import type { UiStore } from "@/components/solid/ui";
import { createContext } from "solid-js";
import type { SetStoreFunction, Store } from "solid-js/store";

export const UiContext =
	createContext<[Store<UiStore>, SetStoreFunction<UiStore>]>();
