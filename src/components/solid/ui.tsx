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

	const regions = createMemo(
		() =>
			appStore?.regionsCollection?.features.map((r) => ({
				id: r.properties.r_id,
				name: r.properties.r_name,
				subs: r.properties.subs,
			})) ?? [],
	);
	const municipalities = createMemo(
		() =>
			appStore?.municipalitiesCollection?.features.map((m) => ({
				id: m.properties.m_id,
				name: m.properties.m_name,
				subs: m.properties.subs,
			})) ?? [],
	);
	const schools = createMemo(
		() =>
			appStore?.schools?.features.map((s) => ({
				id: s.properties.s_id,
				name: s.properties.s_name,
				subs: s.properties.subs,
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
				items={regions()}
				name="r_name"
				storeActiveKey="activeRegionId"
				storeHoverKey="hoverRegionId"
				title="Region"
				placeholder="Vælg region"
				open={regionsOpen()}
				setOpen={setRegionsOpen}
			/>
			<AccordionList
				items={municipalities()}
				name="m_name"
				storeActiveKey="activeMunicipalityId"
				storeHoverKey="hoverMunicipalityId"
				title="Municipalities"
				placeholder="Vælg kommune"
				open={municipalitiesOpen()}
				setOpen={setMunicipalitiesOpen}
				disabled={municipalitiesDisabled()}
			/>
			<AccordionList
				items={schools()}
				name="s_name"
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
