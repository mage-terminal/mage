import type {
	JsonObject,
	IDataObject,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IHttpRequestMethods,
	IRequestOptions,
} from 'mage-workflow';
import { NodeApiError } from 'mage-workflow';

export async function philipsHueApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	resource: string,

	body: any = {},
	qs: IDataObject = {},
	uri?: string,
	headers: IDataObject = {},
): Promise<any> {
	const options: IRequestOptions = {
		headers: {
			'Content-Type': 'application/json',
		},
		method,
		body,
		qs,
		uri: uri || `https://api.meethue.com/route${resource}`,
		json: true,
	};
	try {
		if (Object.keys(headers).length !== 0) {
			options.headers = Object.assign({}, options.headers, headers);
		}

		if (Object.keys(body as IDataObject).length === 0) {
			delete options.body;
		}

		if (Object.keys(qs).length === 0) {
			delete options.qs;
		}

		const response = await this.helpers.requestOAuth2.call(this, 'philipsHueOAuth2Api', options, {
			tokenType: 'Bearer',
		});
		return response;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export async function getUser(this: IExecuteFunctions | ILoadOptionsFunctions): Promise<any> {
	const { whitelist } = await philipsHueApiRequest.call(this, 'GET', '/api/0/config', {}, {});
	//check if there is a mage user
	for (const user of Object.keys(whitelist as IDataObject)) {
		if (whitelist[user].name === 'mage') {
			return user;
		}
	}
	// mage user was not fount then create the user
	await philipsHueApiRequest.call(this, 'PUT', '/api/0/config', { linkbutton: true });
	const { success } = await philipsHueApiRequest.call(this, 'POST', '/api', { devicetype: 'mage' });
	return success.username;
}
