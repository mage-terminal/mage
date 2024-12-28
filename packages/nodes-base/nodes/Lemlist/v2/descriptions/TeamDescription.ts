import type { INodeProperties } from 'mage-workflow';

export const teamOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'get',
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a team',
			},
			{
				name: 'Get Credits',
				value: 'getCredits',
				action: 'Get team credits',
			},
		],
		displayOptions: {
			show: {
				resource: ['team'],
			},
		},
	},
];

export const teamFields: INodeProperties[] = [
	// ----------------------------------
	//        team: get
	// ----------------------------------
];
