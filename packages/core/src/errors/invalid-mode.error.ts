import { ApplicationError } from 'mage-workflow';

import { CONFIG_MODES } from '../BinaryData/utils';

export class InvalidModeError extends ApplicationError {
	constructor() {
		super(`Invalid binary data mode. Valid modes: ${CONFIG_MODES.join(', ')}`);
	}
}
