import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'mage-workflow';

export class mageApi implements ICredentialType {
	name = 'mageApi';

	displayName = 'mage API';

	documentationUrl = 'https://docs.mage.io/api/authentication/';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'The API key for the mage instance',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: '',
			placeholder: 'https://<name>.app.mage.cloud/api/v1',
			description: 'The API URL of the mage instance',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-mage-API-KEY': '={{ $credentials.apiKey }}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{ $credentials.baseUrl }}',
			url: '/workflows?limit=5',
		},
	};
}
