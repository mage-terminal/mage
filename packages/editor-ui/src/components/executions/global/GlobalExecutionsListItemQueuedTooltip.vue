<script lang="ts" setup="">
import type { ExecutionStatus } from 'mage-workflow';
import { useI18n } from '@/composables/useI18n';

const props = defineProps<{
	status: ExecutionStatus;
	concurrencyCap: number;
	isCloudDeployment?: boolean;
}>();

const emit = defineEmits<{
	goToUpgrade: [];
}>();

const i18n = useI18n();
</script>

<template>
	<mageTooltip placement="top">
		<template #content>
			<i18n-t
				v-if="props.status === 'waiting'"
				keypath="executionsList.statusTooltipText.theWorkflowIsWaitingIndefinitely"
			/>
			<i18n-t
				v-if="props.status === 'new'"
				keypath="executionsList.statusTooltipText.waitingForConcurrencyCapacity"
			>
				<template #instance>
					<i18n-t
						v-if="props.isCloudDeployment"
						keypath="executionsList.statusTooltipText.waitingForConcurrencyCapacity.cloud"
					>
						<template #concurrencyCap>{{ props.concurrencyCap }}</template>
						<template #link>
							<mageLink bold size="small" :class="$style.link" @click="emit('goToUpgrade')">
								{{ i18n.baseText('generic.upgradeNow') }}
							</mageLink>
						</template>
					</i18n-t>
					<i18n-t
						v-else
						keypath="executionsList.statusTooltipText.waitingForConcurrencyCapacity.self"
					>
						<template #concurrencyCap>{{ props.concurrencyCap }}</template>
						<template #link>
							<mageLink
								:class="$style.link"
								:href="i18n.baseText('executions.concurrency.docsLink')"
								target="_blank"
								>{{ i18n.baseText('generic.viewDocs') }}</mageLink
							>
						</template>
					</i18n-t>
				</template>
			</i18n-t>
		</template>
		<slot />
	</mageTooltip>
</template>

<style lang="scss" module>
.link {
	display: inline-block;
	margin-top: var(--spacing-xs);
}
</style>
