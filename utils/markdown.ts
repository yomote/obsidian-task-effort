import { SchedulerData } from "@bitnoi.se/react-scheduler";
import { ProjectSummary } from "types/global";

/**
 * Split markdown into tables.
 * @param markdown markdown string
 * @returns object
 */
export function splitTables(markdown: string): { [key: string]: string } {
	const lines = markdown.split("\n");
	const tables: { [key: string]: string } = {};
	let currentTable: string[] = [];
	let currentTableName: string = "";

	for (const line of lines) {
		if (line.includes("START")) {
			// Start a new table
			currentTable = [];
			currentTableName = line.split(":")[1].trim().slice(0, -4); // Extract table name
		} else if (line.includes("END")) {
			// End the current table and add it to the tables object
			tables[currentTableName] = currentTable.join("\n");
		} else if (line.includes("|")) {
			// Add the line to the current table
			currentTable.push(line);
		}
	}

	return tables;
}

/**
 * Parse project config.
 * @param table markdown-style table
 * @returns object
 */
export function parseProjectConfig(table: string): object {
	const rows = table
		.split("\n")
		.map((row) => row.split("|").map((cell) => cell.trim()));
	const projectConfig = {
		name: rows[0][2],
	};

	return projectConfig;
}

/**
 * Convert markdown-style table to Master Schedule Data.
 * @param table markdown-style table
 * @returns Task[]
 */
export function createMasterSchedule(
	table: string,
	projectConfig: any
): [ProjectSummary, SchedulerData] {
	const rows = table
		.split("\n")
		.map((row) => row.split("|").map((cell) => cell.trim()));
	const headers = rows[0].map((cell) => cell.toLowerCase());
	const data = rows.slice(2);

	console.log("Data", data);

	// Calculate total effort
	const totalEffort = data.reduce(
		(acc, row) => acc + Number(row[headers.indexOf("effort [man-day]")]),
		0
	);

	// Find project start and end dates
	const startDates = data.map(
		(row) => new Date(row[headers.indexOf("start date")])
	);
	const endDates = data.map(
		(row) => new Date(row[headers.indexOf("end date")])
	);
	const minStartDate = new Date(
		Math.min(...startDates.map((date) => date.getTime()))
	);
	const maxEndDate = new Date(
		Math.max(...endDates.map((date) => date.getTime()))
	);

	// Create project summary
	const projectSummary: ProjectSummary = {
		name: projectConfig.name,
		totalEffort: totalEffort,
		startDate: minStartDate,
		endDate: maxEndDate,
	};

	// Create scheduler data
	const schdule = data.map((row, index) => {
		const task = {
			id: "task-" + index.toString(),
			label: {
				icon: "",
				title: row[headers.indexOf("title")],
				subtitle: "",
			},
			data: [
				{
					id: "task-" + index.toString(),
					title: row[headers.indexOf("start date")],
					subtitle: row[headers.indexOf("end date")],
					startDate: new Date(row[headers.indexOf("start date")]),
					endDate: new Date(row[headers.indexOf("end date")]),
					occupancy: 3600,
				},
			],
		};

		return task;
	}) as SchedulerData;

	return [projectSummary, schdule];
}
