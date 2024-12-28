import { ApplicationError } from 'mage-workflow';

export abstract class FileSystemError extends ApplicationError {
	constructor(message: string, filePath: string) {
		super(message, { extra: { filePath } });
	}
}
