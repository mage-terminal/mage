import {
	NodeConnectionType,
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
} from 'mage-workflow';

export class mageTrainingCustomerMessenger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Customer Messenger (mage training)',
		name: 'mageTrainingCustomerMessenger',
		icon: {
			light: 'file:mageTrainingCustomerMessenger.svg',
			dark: 'file:mageTrainingCustomerMessenger.dark.svg',
		},
		group: ['transform'],
		version: 1,
		description: 'Dummy node used for mage training',
		defaults: {
			name: 'Customer Messenger (mage training)',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		properties: [
			{
				displayName: 'Customer ID',
				name: 'customerId',
				type: 'string',
				required: true,
				default: '',
			},
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				required: true,
				typeOptions: {
					rows: 4,
				},
				default: '',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const length = items.length;
		let responseData;

		for (let i = 0; i < length; i++) {
			const customerId = this.getNodeParameter('customerId', i) as string;

			const message = this.getNodeParameter('message', i) as string;

			responseData = { output: `Sent message to customer ${customerId}:  ${message}` };
			const executionData = this.helpers.constructExecutionMetaData(
				this.helpers.returnJsonArray(responseData),
				{ itemData: { item: i } },
			);

			returnData.push(...executionData);
		}
		return [returnData];
	}
}
