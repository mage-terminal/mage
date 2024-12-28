import type { PushMessage } from '@mage/api-types';

export type PushMessageQueueItem = {
	message: PushMessage;
	retriesLeft: number;
};
