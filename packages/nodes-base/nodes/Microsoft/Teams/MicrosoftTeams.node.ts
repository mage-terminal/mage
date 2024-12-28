import type { INodeTypeBaseDescription, IVersionedNodeType } from 'mage-workflow';
import { VersionedNodeType } from 'mage-workflow';

import { MicrosoftTeamsV1 } from './v1/MicrosoftTeamsV1.node';
import { MicrosoftTeamsV2 } from './v2/MicrosoftTeamsV2.node';

export class MicrosoftTeams extends VersionedNodeType {
	constructor() {
		const baseDescription: INodeTypeBaseDescription = {
			displayName: 'Microsoft Teams',
			name: 'microsoftTeams',
			icon: 'file:teams.svg',
			group: ['input'],
			description: 'Consume Microsoft Teams API',
			defaultVersion: 2,
		};

		const nodeVersions: IVersionedNodeType['nodeVersions'] = {
			1: new MicrosoftTeamsV1(baseDescription),
			1.1: new MicrosoftTeamsV1(baseDescription),
			2: new MicrosoftTeamsV2(baseDescription),
		};

		super(nodeVersions, baseDescription);
	}
}
