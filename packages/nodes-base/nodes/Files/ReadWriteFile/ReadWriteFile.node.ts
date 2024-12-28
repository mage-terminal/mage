import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'mage-workflow';
import { NodeConnectionType } from 'mage-workflow';

import * as read from './actions/read.operation';
import * as write from './actions/write.operation';

export class ReadWriteFile implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Read/Write Files from Disk',
		name: 'readWriteFile',
		icon: 'file:readWriteFile.svg',
		group: ['input'],
		version: 1,
		description: 'Read or write files from the computer that runs mage',
		defaults: {
			name: 'Read/Write Files from Disk',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		properties: [
			{
				displayName:
					'Use this node to read and write files on the same computer running mage. To handle files between different computers please use other nodes (e.g. FTP, HTTP Request, AWS).',
				name: 'info',
				type: 'notice',
				default: '',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Read File(s) From Disk',
						value: 'read',
						description: 'Retrieve one or more files from the computer that runs mage',
						action: 'Read File(s) From Disk',
					},
					{
						name: 'Write File to Disk',
						value: 'write',
						description: 'Create a binary file on the computer that runs mage',
						action: 'Write File to Disk',
					},
				],
				default: 'read',
			},
			...read.description,
			...write.description,
		],
	};

	async execute(this: IExecuteFunctions) {
		const operation = this.getNodeParameter('operation', 0, 'read');
		const items = this.getInputData();
		let returnData: INodeExecutionData[] = [];

		if (operation === 'read') {
			returnData = await read.execute.call(this, items);
		}

		if (operation === 'write') {
			returnData = await write.execute.call(this, items);
		}

		return [returnData];
	}
}
