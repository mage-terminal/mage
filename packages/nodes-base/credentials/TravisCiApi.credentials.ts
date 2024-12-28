import type { ICredentialType, INodeProperties } from 'mage-workflow';

export class TravisCiApi implements ICredentialType {
	name = 'travisCiApi';

	displayName = 'Travis API';

	documentationUrl = 'travisCi';

	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];
}
