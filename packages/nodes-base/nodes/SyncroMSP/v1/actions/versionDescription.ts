/* eslint-disable mage-nodes-base/node-filename-against-convention */
import { NodeConnectionType, type INodeTypeDescription } from 'mage-workflow';

import * as contact from './contact';
import * as customer from './customer';
import * as rmm from './rmm';
import * as ticket from './ticket';

export const versionDescription: INodeTypeDescription = {
	displayName: 'SyncroMSP',
	name: 'syncroMsp',
	// eslint-disable-next-line mage-nodes-base/node-class-description-icon-not-svg
	icon: 'file:syncromsp.png',
	group: ['output'],
	version: 1,
	subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
	description: 'Gets data from SyncroMSP',
	defaults: {
		name: 'SyncroMSP',
	},
	inputs: [NodeConnectionType.Main],
	outputs: [NodeConnectionType.Main],
	credentials: [
		{
			name: 'syncroMspApi',
			required: true,
			testedBy: 'syncroMspApiCredentialTest',
		},
	],
	properties: [
		{
			displayName: 'Resource',
			name: 'resource',
			type: 'options',
			noDataExpression: true,
			options: [
				{
					name: 'Contact',
					value: 'contact',
				},
				{
					name: 'Customer',
					value: 'customer',
				},
				{
					name: 'RMM',
					value: 'rmm',
				},
				{
					name: 'Ticket',
					value: 'ticket',
				},
			],
			default: 'contact',
		},
		...customer.descriptions,
		...ticket.descriptions,
		...contact.descriptions,
		...rmm.descriptions,
	],
};