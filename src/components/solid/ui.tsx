import { AccordionList } from "@/components/solid/accordion-list";
import { AppContext } from "@/scripts/app-context";
import { store } from "@/scripts/store";
import {
	type VoidComponent,
	createEffect,
	createMemo,
	createSignal,
	useContext,
} from "solid-js";

export const Ui: VoidComponent = () => {
	const appStore = useContext(AppContext);

	const [regionsOpen, setRegionsOpen] = createSignal(true);
	const [municipalitiesOpen, setMunicipalitiesOpen] = createSignal(false);
	const [schoolsOpen, setSchoolsOpen] = createSignal(false);

	const regionItems = createMemo(
		() =>
			appStore?.regionsCollection?.features.map((f) => ({
				id: f.properties.r_id,
				name: f.properties.r_name,
				subs: f.properties.subs,
			})) ?? [],
	);
	const municipalityItems = createMemo(
		() =>
			appStore?.municipalitiesCollection?.features.map((f) => ({
				id: f.properties.m_id,
				name: f.properties.m_name,
				subs: f.properties.subs,
			})) ?? [],
	);
	const schoolItems = createMemo(
		() =>
			appStore?.schools?.features.map((f) => ({
				id: f.properties.s_id,
				name: f.properties.s_name,
				subs: f.properties.subs,
			})) ?? [],
	);

	const municipalitiesDisabled = createMemo(
		() =>
			!appStore?.regionsCollection?.features.find(
				(r) => r.id === store.activeRegionId,
			),
	);

	const schoolsDisabled = createMemo(
		() =>
			!appStore?.municipalitiesCollection?.features.find(
				(m) => m.id === store.activeMunicipalityId,
			),
	);

	createEffect(() => {
		if (!regionsOpen() && !municipalitiesDisabled()) {
			setMunicipalitiesOpen(true);
		} else {
			setMunicipalitiesOpen(false);
		}
	});

	createEffect(() => {
		if (!regionsOpen() && !municipalitiesOpen() && !schoolsDisabled()) {
			setSchoolsOpen(true);
		} else {
			setSchoolsOpen(false);
		}
	});

	return (
		<div class="hidden h-fit max-h-full w-full grid-cols-1 items-start gap-6 overflow-hidden p-6 md:grid">
			<AccordionList
				items={regionItems()}
				storeActiveKey="activeRegionId"
				storeHoverKey="hoverRegionId"
				title="Region"
				placeholder="Vælg region"
				open={regionsOpen()}
				setOpen={setRegionsOpen}
			/>
			<AccordionList
				items={municipalityItems()}
				storeActiveKey="activeMunicipalityId"
				storeHoverKey="hoverMunicipalityId"
				title="Municipalities"
				placeholder="Vælg kommune"
				open={municipalitiesOpen()}
				setOpen={setMunicipalitiesOpen}
				disabled={municipalitiesDisabled()}
			/>
			<AccordionList
				items={schoolItems()}
				storeActiveKey="activeSchoolId"
				storeHoverKey="hoverSchoolId"
				title="Schools"
				placeholder="Vælg skole"
				open={schoolsOpen()}
				setOpen={setSchoolsOpen}
				disabled={schoolsDisabled()}
			/>
		</div>
	);
};
