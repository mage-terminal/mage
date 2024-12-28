import type { AllEntities } from 'mage-workflow';

type NodeMap = {
	channel: 'get' | 'getAll' | 'create' | 'update' | 'deleteChannel';
	message: 'deleteMessage' | 'getAll' | 'get' | 'react' | 'send';
	member: 'getAll' | 'roleAdd' | 'roleRemove';
	webhook: 'sendLegacy';
};

export type Discord = AllEntities<NodeMap>;
