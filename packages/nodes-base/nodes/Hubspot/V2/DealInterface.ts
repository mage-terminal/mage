import type { IDataObject } from 'mage-workflow';

export interface IAssociation {
	associatedCompanyIds?: number[];
	associatedVids?: number[];
}

export interface IDeal {
	associations?: IAssociation;
	properties?: IDataObject[];
}
