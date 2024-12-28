import type { IDataObject } from 'mage-workflow';

export interface IContext {
	goToWebinarWebinarKey?: string;
	hutk?: string;
	ipAddress?: string;
	pageId?: string;
	pageName?: string;
	pageUri?: string;
	sfdcCampaignId?: string;
}

export interface IForm {
	portalId?: number;
	formId?: string;
	fields?: IDataObject[];
	legalConsentOptions?: IDataObject;
	context?: IContext[];
	submittedAt?: number;
	skipValidation?: boolean;
}
