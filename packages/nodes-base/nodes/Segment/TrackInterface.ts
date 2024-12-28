import type { IDataObject } from 'mage-workflow';

export interface ITrack {
	event?: string;
	userId?: string;
	name?: string;
	anonymousId?: string;
	traits?: IDataObject;
	context?: IDataObject;
	timestamp?: string;
	properties?: IDataObject;
	integrations?: IDataObject;
}

export interface IGroup extends ITrack {
	groupId: string;
}
