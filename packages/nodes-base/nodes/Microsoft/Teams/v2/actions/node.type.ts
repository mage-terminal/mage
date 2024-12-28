import type { AllEntities } from 'mage-workflow';

type NodeMap = {
	channel: 'create' | 'deleteChannel' | 'get' | 'getAll' | 'update';
	channelMessage: 'create' | 'getAll';
	chatMessage: 'create' | 'get' | 'getAll';
	task: 'create' | 'deleteTask' | 'get' | 'getAll' | 'update';
};

export type MicrosoftTeamsType = AllEntities<NodeMap>;
