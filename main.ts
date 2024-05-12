import {
	App,
	Editor,
	MarkdownFileInfo,
	MarkdownView,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";

import effortTableTemplate from "./effort-table-template.txt";

import { WorkspaceLeaf } from "obsidian";

import { GanttView, VIEW_TYPE_GANTT } from "./views/GanttView";
import {
	splitTables,
	parseProjectConfig,
	createMasterSchedule,
} from "./utils/markdown";
import { SchedulerData } from "@bitnoi.se/react-scheduler";
import { ProjectSummary } from "types/global";

interface TaskEffortPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: TaskEffortPluginSettings = {
	mySetting: "default",
};

export default class TaskEffortPlugin extends Plugin {
	settings: TaskEffortPluginSettings | undefined;

	async onload() {
		await this.loadSettings();

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText("Status Bar Text");

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: "sample-editor-command",
			name: "Sample editor command",
			editorCallback: (
				editor: Editor,
				ctx: MarkdownView | MarkdownFileInfo
			) => {
				console.log(editor.getSelection());
				editor.replaceSelection("Sample Editor Command");
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new TaskEffortSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, "click", (evt: MouseEvent) => {
			console.log("click", evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		);

		this.registerView(
			VIEW_TYPE_GANTT,
			(leaf: WorkspaceLeaf) => new GanttView(leaf)
		);

		// this.addRibbonIcon("dice", "Nice!!!!!", () => {
		// 	new Notice("Hello, world!!!!!!!!こんちは");
		// });

		this.addRibbonIcon("gantt-chart", "Show Gantt View", () => {
			const markdownView =
				this.app.workspace.getActiveViewOfType(MarkdownView);
			if (!markdownView) {
				new Notice("No active Markdown view.");
				return;
			}

			const editor = markdownView.editor;
			const tables = splitTables(editor.getValue());
			const projectConfigTable = tables["project-config"];
			const effortTable = tables["effort-table"];

			if (!projectConfigTable || !effortTable) {
				new Notice("No project config or effort table found.");
				return;
			}

			const projectConfig = parseProjectConfig(projectConfigTable);

			const [projectSummary, masterSchedule] = createMasterSchedule(
				effortTable,
				projectConfig
			);

			this.activateView(projectSummary, masterSchedule);
		});

		this.addCommand({
			id: "insert-effort-table",
			name: "Insert Effort Table",
			editorCallback: (editor: Editor) => {
				editor.replaceRange(effortTableTemplate, editor.getCursor());
			},
		});
	}

	onunload() {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_GANTT);
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async activateView(
		projectSummary: ProjectSummary,
		masterSchedule: SchedulerData
	) {
		const { workspace } = this.app;

		workspace.detachLeavesOfType(VIEW_TYPE_GANTT);
		await workspace.getLeaf("split").setViewState({
			type: VIEW_TYPE_GANTT,
			active: true,
		});
		const leaf = workspace.getLeavesOfType(VIEW_TYPE_GANTT)[0];
		workspace.revealLeaf(leaf);

		const view = leaf.view as GanttView;
		view.setState(
			{ projectSummary: projectSummary, schedulerData: masterSchedule },
			{
				history: false,
			}
		);
		view.display();

		return view;
	}
}

class TaskEffortSettingTab extends PluginSettingTab {
	plugin: TaskEffortPlugin;

	constructor(app: App, plugin: TaskEffortPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Setting #1")
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings?.mySetting ?? "")
					.onChange(async (value) => {
						if (this.plugin.settings) {
							this.plugin.settings.mySetting = value ?? "";
						}
						await this.plugin.saveSettings();
					})
			);
	}
}
