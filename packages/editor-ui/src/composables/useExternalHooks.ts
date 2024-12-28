import type { IDataObject } from 'mage-workflow';
import type {
	ExternalHooks,
	ExternalHooksKey,
	ExternalHooksGenericContext,
	ExtractExternalHooksMethodPayloadFromKey,
} from '@/types/externalHooks';
import { useWebhooksStore } from '@/stores/webhooks.store';

export async function runExternalHook<T extends ExternalHooksKey>(
	eventName: T,
	metadata?: ExtractExternalHooksMethodPayloadFromKey<T>,
) {
	if (!window.mageExternalHooks) {
		return;
	}

	const store = useWebhooksStore();

	const [resource, operator] = eventName.split('.') as [
		keyof ExternalHooks,
		keyof ExternalHooks[keyof ExternalHooks],
	];

	const context = window.mageExternalHooks[resource] as ExternalHooksGenericContext;
	if (context?.[operator]) {
		const hookMethods = context[operator];

		for (const hookMethod of hookMethods) {
			await hookMethod(store, metadata as IDataObject);
		}
	}
}

export function useExternalHooks() {
	return {
		run: runExternalHook,
	};
}
