import type { IDataObject } from 'mage-workflow';

export interface IAttachment {
	url: string;
	filename: string;
	type: string;
}

export interface IRecord {
	fields: {
		[key: string]: string | IAttachment[];
	};
}

export type UpdateRecord = {
	fields: IDataObject;
	id?: string;
};
export type UpdateBody = {
	records: UpdateRecord[];
	performUpsert?: {
		fieldsToMergeOn: string[];
	};
	typecast?: boolean;
};
