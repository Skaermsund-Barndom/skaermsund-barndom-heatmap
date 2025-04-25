import type { AppProps } from "@/components/solid/app";
import { createContext } from "solid-js";
import type { Store } from "solid-js/store";

export const AppContext = createContext<Store<AppProps>>();
