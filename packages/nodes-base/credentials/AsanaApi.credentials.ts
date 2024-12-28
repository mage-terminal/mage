import type { IAuthenticateGeneric, ICredentialType, INodeProperties } from 'mage-workflow';

export class AsanaApi implements ICredentialType {
	name = 'asanaApi';

	displayName = 'Asana API';

	documentationUrl = 'asana';

	properties: INodeProperties[] = [
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.accessToken}}',
			},
		},
	};
}
