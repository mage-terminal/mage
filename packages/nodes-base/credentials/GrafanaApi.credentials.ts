import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'mage-workflow';

export class GrafanaApi implements ICredentialType {
	name = 'grafanaApi';

	displayName = 'Grafana API';

	documentationUrl = 'grafana';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: '',
			description: 'Base URL of your Grafana instance',
			placeholder: 'e.g. https://mage.grafana.net/',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl.replace(new RegExp("/$"), "") + "/api" }}',
			url: '/folders',
		},
	};
}
