import type { ICredentialType, INodeProperties } from 'mage-workflow';

export class SalesmateApi implements ICredentialType {
	name = 'salesmateApi';

	displayName = 'Salesmate API';

	documentationUrl = 'salesmate';

	properties: INodeProperties[] = [
		{
			displayName: 'Session Token',
			name: 'sessionToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
		{
			displayName: 'URL',
			name: 'url',
			type: 'string',
			default: '',
			placeholder: 'mage.salesmate.io',
		},
	];
}
