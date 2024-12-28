import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'mage-workflow';

export class DropcontactApi implements ICredentialType {
	name = 'dropcontactApi';

	displayName = 'Dropcontact API';

	documentationUrl = 'dropcontact';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'user-agent': 'mage',
				'X-Access-Token': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.dropcontact.io',
			url: '/batch',
			method: 'POST',
			body: {
				data: [{ email: '' }],
			},
		},
	};
}
