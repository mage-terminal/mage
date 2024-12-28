import type { INodeTypeBaseDescription, IVersionedNodeType } from 'mage-workflow';
import { VersionedNodeType } from 'mage-workflow';

import { WebflowTriggerV1 } from './V1/WebflowTriggerV1.node';
import { WebflowTriggerV2 } from './V2/WebflowTriggerV2.node';

export class WebflowTrigger extends VersionedNodeType {
	constructor() {
		const baseDescription: INodeTypeBaseDescription = {
			displayName: 'Webflow Trigger',
			name: 'webflowTrigger',
			icon: 'file:webflow.svg',
			group: ['trigger'],
			description: 'Handle Webflow events via webhooks',
			defaultVersion: 2,
		};

		const nodeVersions: IVersionedNodeType['nodeVersions'] = {
			1: new WebflowTriggerV1(baseDescription),
			2: new WebflowTriggerV2(baseDescription),
		};

		super(nodeVersions, baseDescription);
	}
}
