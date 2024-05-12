import { ProjectSummary } from "types/global";
import { SummaryContainer, Row, Key, Value } from "./styles";

interface SummaryProps {
	projectSummary: ProjectSummary;
}

export const Summary: React.FC<SummaryProps> = ({ projectSummary }) => {
	return (
		<>
			<SummaryContainer>
				<Row>
					<Key>Project Name</Key>
					<Value>{projectSummary.name}</Value>
				</Row>
				<Row>
					<Key>Total Effort</Key>
					<Value>{projectSummary.totalEffort}</Value>
				</Row>
				<Row>
					<Key>Project Start Date</Key>
					<Value>
						{projectSummary.startDate.toLocaleDateString()}
					</Value>
				</Row>
				<Row>
					<Key>Project End Date</Key>
					<Value>{projectSummary.endDate.toLocaleDateString()}</Value>
				</Row>
			</SummaryContainer>
		</>
	);
};
