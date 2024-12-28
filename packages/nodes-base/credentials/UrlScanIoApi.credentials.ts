import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'mage-workflow';

export class UrlScanIoApi implements ICredentialType {
	name = 'urlScanIoApi';

	displayName = 'urlscan.io API';

	documentationUrl = 'urlScanIo';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'API-KEY': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://urlscan.io',
			url: '/user/quotas',
		},
	};
}
