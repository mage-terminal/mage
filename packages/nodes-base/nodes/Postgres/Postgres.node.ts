import type { INodeTypeBaseDescription, IVersionedNodeType } from 'mage-workflow';
import { VersionedNodeType } from 'mage-workflow';

import { PostgresV1 } from './v1/PostgresV1.node';
import { PostgresV2 } from './v2/PostgresV2.node';

export class Postgres extends VersionedNodeType {
	constructor() {
		const baseDescription: INodeTypeBaseDescription = {
			displayName: 'Postgres',
			name: 'postgres',
			icon: 'file:postgres.svg',
			group: ['input'],
			defaultVersion: 2.5,
			description: 'Get, add and update data in Postgres',
			parameterPane: 'wide',
		};

		const nodeVersions: IVersionedNodeType['nodeVersions'] = {
			1: new PostgresV1(baseDescription),
			2: new PostgresV2(baseDescription),
			2.1: new PostgresV2(baseDescription),
			2.2: new PostgresV2(baseDescription),
			2.3: new PostgresV2(baseDescription),
			2.4: new PostgresV2(baseDescription),
			2.5: new PostgresV2(baseDescription),
		};

		super(nodeVersions, baseDescription);
	}
}
