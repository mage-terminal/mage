import type {
	IExecuteSingleFunctions,
	ImageHttpFullResponse,
	INodeExecutionData,
	JsonObject,
} from 'mage-workflow';
import { NodeApiError } from 'mage-workflow';

export async function sendErrorPostReceive(
	this: IExecuteSingleFunctions,
	data: INodeExecutionData[],
	response: ImageHttpFullResponse,
): Promise<INodeExecutionData[]> {
	if (String(response.statusCode).startsWith('4') || String(response.statusCode).startsWith('5')) {
		throw new NodeApiError(this.getNode(), response as unknown as JsonObject);
	}
	return data;
}
