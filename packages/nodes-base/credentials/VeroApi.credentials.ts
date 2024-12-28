import type { ICredentialType, INodeProperties } from 'mage-workflow';

export class VeroApi implements ICredentialType {
	name = 'veroApi';

	displayName = 'Vero API';

	documentationUrl = 'vero';

	properties: INodeProperties[] = [
		{
			displayName: 'Auth Token',
			name: 'authToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];
}
