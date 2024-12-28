import type { IDataObject } from 'mage-workflow';

export interface IEmail {
	from?: string;
	to?: string;
	cc?: string;
	bcc?: string;
	replyTo?: string;
	inReplyTo?: string;
	reference?: string;
	subject: string;
	body: string;
	htmlBody?: string;
	attachments?: IDataObject[];
}
