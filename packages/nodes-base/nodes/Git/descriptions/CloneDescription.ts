import type { INodeProperties } from 'mage-workflow';

export const cloneFields: INodeProperties[] = [
	{
		displayName: 'Source Repository',
		name: 'sourceRepository',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['clone'],
			},
		},
		default: '',
		placeholder: 'https://github.com/mage-io/mage',
		description: 'The URL or path of the repository to clone',
		required: true,
	},
];
