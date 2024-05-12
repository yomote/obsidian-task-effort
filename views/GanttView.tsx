import { Root, createRoot } from "react-dom/client";
import { ItemView, ViewStateResult, WorkspaceLeaf } from "obsidian";

import { Gantt } from "../components/Gantt/Gantt";
import { Summary } from "../components/Summary/Summary";
import { SchedulerData } from "@bitnoi.se/react-scheduler";
import { ProjectSummary } from "types/global";

export const VIEW_TYPE_GANTT = "gantt-view";

interface GanttState {
	projectSummary: ProjectSummary;
	schedulerData: SchedulerData;
}

export class GanttView extends ItemView implements GanttState {
	root: Root | null = null;
	projectSummary: ProjectSummary;
	schedulerData: SchedulerData;

	constructor(readonly leaf: WorkspaceLeaf) {
		super(leaf);

		this.projectSummary = {
			name: "",
			totalEffort: 0,
			startDate: new Date(),
			endDate: new Date(),
		};
		this.schedulerData = [];
	}

	async setState(state: GanttState, result: ViewStateResult): Promise<void> {
		console.log("State", state);

		if (state.projectSummary) {
			this.projectSummary = state.projectSummary;
		}

		if (state.schedulerData) {
			this.schedulerData = [...state.schedulerData];
		}

		console.log("FPP", this.schedulerData);
		return super.setState(state, result);
	}

	getState(): GanttState {
		return {
			projectSummary: this.projectSummary,
			schedulerData: this.schedulerData,
		};
	}

	getViewType() {
		return VIEW_TYPE_GANTT;
	}

	getDisplayText() {
		return "Gantt chart view";
	}

	async display(): Promise<void> {
		console.log("Display");
		this.root?.render(
			<>
				<Summary projectSummary={this.projectSummary} />
				<Gantt schedulerData={this.schedulerData} />
			</>
		);
	}

	async onOpen() {
		console.log("Open");
		this.root = createRoot(this.containerEl.children[1]);
		this.display();
	}

	async onClose() {
		this.root?.unmount();
	}
}
