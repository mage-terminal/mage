import type { ILoadOptionsFunctions, INodePropertyOptions } from 'mage-workflow';

import { splunkApiJsonRequest } from '../transport';

export async function getRoles(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const endpoint = '/services/authorization/roles';
	const responseData = await splunkApiJsonRequest.call(this, 'GET', endpoint);

	return (responseData as Array<{ id: string }>).map((entry) => ({
		name: entry.id,
		value: entry.id,
	}));
}
