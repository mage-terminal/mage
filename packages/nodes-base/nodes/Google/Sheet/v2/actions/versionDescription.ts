/* eslint-disable mage-nodes-base/node-filename-against-convention */
import { NodeConnectionType, type INodeTypeDescription } from 'mage-workflow';

import * as sheet from './sheet/Sheet.resource';
import * as spreadsheet from './spreadsheet/SpreadSheet.resource';

export const versionDescription: INodeTypeDescription = {
	displayName: 'Google Sheets',
	name: 'googleSheets',
	icon: 'file:googleSheets.svg',
	group: ['input', 'output'],
	version: [3, 4, 4.1, 4.2, 4.3, 4.4, 4.5],
	subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
	description: 'Read, update and write data to Google Sheets',
	defaults: {
		name: 'Google Sheets',
	},
	inputs: [NodeConnectionType.Main],
	outputs: [NodeConnectionType.Main],
	usableAsTool: true,
	hints: [
		{
			message:
				"Use the 'Minimise API Calls' option for greater efficiency if your sheet is uniformly formatted without gaps between columns or rows",
			displayCondition:
				'={{$parameter["operation"] === "append" && !$parameter["options"]["useAppend"]}}',
			whenToDisplay: 'beforeExecution',
			location: 'outputPane',
		},
		{
			message: 'No columns found in Google Sheet. All rows will be appended',
			displayCondition:
				'={{ ["appendOrUpdate", "append"].includes($parameter["operation"]) && $parameter?.columns?.mappingMode === "defineBelow" && !$parameter?.columns?.schema?.length }}',
			whenToDisplay: 'beforeExecution',
			location: 'outputPane',
		},
	],
	credentials: [
		{
			name: 'googleApi',
			required: true,
			displayOptions: {
				show: {
					authentication: ['serviceAccount'],
				},
			},
			testedBy: 'googleApiCredentialTest',
		},
		{
			name: 'googleSheetsOAuth2Api',
			required: true,
			displayOptions: {
				show: {
					authentication: ['oAuth2'],
				},
			},
		},
	],
	properties: [
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'options',
			options: [
				{
					name: 'Service Account',
					value: 'serviceAccount',
				},
				{
					// eslint-disable-next-line mage-nodes-base/node-param-display-name-miscased
					name: 'OAuth2 (recommended)',
					value: 'oAuth2',
				},
			],
			default: 'oAuth2',
		},
		{
			displayName: 'Resource',
			name: 'resource',
			type: 'options',
			noDataExpression: true,
			options: [
				{
					name: 'Document',
					value: 'spreadsheet',
				},
				{
					name: 'Sheet Within Document',
					value: 'sheet',
				},
			],
			default: 'sheet',
		},
		...sheet.descriptions,
		...spreadsheet.descriptions,
	],
};