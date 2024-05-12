import styled from "styled-components";

export const SummaryContainer = styled.div`
	width: 50%;
	margin: 40px auto;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	border-radius: 8px;
	background-color: #f7f7f7;
	padding: 20px;
`;

export const Row = styled.div`
	display: flex;
	width: 100%;
	padding: 10px 0;
`;

export const Key = styled.div`
	flex-basis: 40%;
	font-weight: bold;
	color: #333;
	padding-right: 20px;
	text-align: left;
	font-size: 18px;
`;

export const Value = styled.div`
	flex-basis: 60%;
	text-align: left;
	font-size: 18px;
`;
