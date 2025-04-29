import { AttributionControl } from "@/components/maplibre/attribution-control";
import { BackControls } from "@/components/solid/back-controls";
import { LayerOrder } from "@/components/solid/layer-order";
import { ZoomControls } from "@/components/solid/zoom-controls";
import type { MapProps } from "@/scripts/types";
import type { VoidComponent } from "solid-js";

interface Props extends MapProps {}

export const LoadedMap: VoidComponent<Props> = (props) => {
	return (
		<>
			<LayerOrder {...props} />
			<AttributionControl
				{...props}
				options={{
					customAttribution: `<a href="https://maplibre.org/" target="_blank" rel="noopener noreferrer" class="bg-primary-80/50 rounded-full px-2 py-1 m-1.5 text-container flex">© MapLibre</a>`,
					compact: false,
				}}
				position="bottom-left"
			/>
			<ZoomControls {...props} />
			<BackControls {...props} />
		</>
	);
};
