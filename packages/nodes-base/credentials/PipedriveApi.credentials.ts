import type { IAuthenticateGeneric, ICredentialType, INodeProperties } from 'mage-workflow';

export class PipedriveApi implements ICredentialType {
	name = 'pipedriveApi';

	displayName = 'Pipedrive API';

	documentationUrl = 'pipedrive';

	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			qs: {
				api_token: '={{$credentials.apiToken}}',
			},
		},
	};
}
