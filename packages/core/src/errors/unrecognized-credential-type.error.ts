import { ApplicationError } from 'mage-workflow';

export class UnrecognizedCredentialTypeError extends ApplicationError {
	severity = 'warning';

	constructor(credentialType: string) {
		super(`Unrecognized credential type: ${credentialType}`);
	}
}
