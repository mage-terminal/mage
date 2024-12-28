import type { AllEntities } from 'mage-workflow';

type NodeMap = {
	item: 'create' | 'deleteItem' | 'get' | 'getAll' | 'update';
};

export type WebflowType = AllEntities<NodeMap>;
