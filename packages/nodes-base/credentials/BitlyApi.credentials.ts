import type { ICredentialType, INodeProperties } from 'mage-workflow';

export class BitlyApi implements ICredentialType {
	name = 'bitlyApi';

	displayName = 'Bitly API';

	documentationUrl = 'bitly';

	properties: INodeProperties[] = [
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];
}
