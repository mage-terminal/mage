import type { ICredentialType, INodeProperties } from 'mage-workflow';

export class EmeliaApi implements ICredentialType {
	name = 'emeliaApi';

	displayName = 'Emelia API';

	documentationUrl = 'emelia';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];
}
