import { Scheduler, SchedulerData } from "@bitnoi.se/react-scheduler";
import { useEffect, useState } from "react";
import { ScheDulerContainer } from "./styles";

interface GanttProps {
	schedulerData: SchedulerData;
}

export const Gantt: React.FC<GanttProps> = ({ schedulerData }) => {
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setIsLoading(true);

		setIsLoading(false);
	}, [schedulerData]);

	return (
		<>
			<ScheDulerContainer>
				<Scheduler
					isLoading={isLoading}
					data={schedulerData}
					onItemClick={(clickedItem) => console.log(clickedItem)}
					onFilterData={() => {
						// filter your data
					}}
					onClearFilterData={() => {
						// clear all your filters
					}}
					config={{
						filterButtonState: 0,
						zoom: 0,
						lang: "en",
						maxRecordsPerPage: 20,
					}}
				/>
			</ScheDulerContainer>
		</>
	);
};
