import type { ICredentialType, INodeProperties } from 'mage-workflow';

export class ProfitWellApi implements ICredentialType {
	name = 'profitWellApi';

	displayName = 'ProfitWell API';

	documentationUrl = 'profitWell';

	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Your Private Token',
		},
	];
}
