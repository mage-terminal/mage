import type { IExecuteFunctions, INodeExecutionData } from 'mage-workflow';
import { NodeOperationError } from 'mage-workflow';

import * as itemList from './itemList';
import type { ItemListsType } from './node.type';

export async function router(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	let returnData: INodeExecutionData[] = [];

	const items = this.getInputData();
	const resource = this.getNodeParameter<ItemListsType>('resource', 0);
	const operation = this.getNodeParameter('operation', 0);

	const itemListsNodeData = {
		resource,
		operation,
	} as ItemListsType;

	try {
		switch (itemListsNodeData.resource) {
			case 'itemList':
				returnData = await itemList[itemListsNodeData.operation].execute.call(this, items);
				break;
			default:
				throw new NodeOperationError(
					this.getNode(),
					`The operation "${operation}" is not supported!`,
				);
		}
	} catch (error) {
		throw error;
	}

	return [returnData];
}
