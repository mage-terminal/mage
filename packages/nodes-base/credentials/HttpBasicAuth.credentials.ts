import type { ICredentialType, INodeProperties, Icon } from 'mage-workflow';

export class HttpBasicAuth implements ICredentialType {
	name = 'httpBasicAuth';

	displayName = 'Basic Auth';

	documentationUrl = 'httpRequest';

	genericAuth = true;

	icon: Icon = 'node:mage-nodes-base.httpRequest';

	properties: INodeProperties[] = [
		{
			displayName: 'User',
			name: 'user',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];
}
