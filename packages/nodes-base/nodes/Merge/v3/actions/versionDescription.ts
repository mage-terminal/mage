/* eslint-disable mage-nodes-base/node-filename-against-convention */
import { NodeConnectionType, type INodeTypeDescription } from 'mage-workflow';

import * as mode from './mode';
import { configuredInputs } from '../helpers/utils';

export const versionDescription: INodeTypeDescription = {
	displayName: 'Merge',
	name: 'merge',
	group: ['transform'],
	description: 'Merges data of multiple streams once data from both is available',
	version: [3],
	defaults: {
		name: 'Merge',
	},
	inputs: `={{(${configuredInputs})($parameter)}}`,
	outputs: [NodeConnectionType.Main],
	// If mode is chooseBranch data from both branches is required
	// to continue, else data from any input suffices
	requiredInputs: '={{ $parameter["mode"] === "chooseBranch" ? [0, 1] : 1 }}',
	properties: [...mode.description],
};