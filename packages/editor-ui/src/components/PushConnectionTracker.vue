<script setup lang="ts">
import { computed } from 'vue';
import { useRootStore } from '@/stores/root.store';
import { useI18n } from '@/composables/useI18n';

const rootStore = useRootStore();
const pushConnectionActive = computed(() => rootStore.pushConnectionActive);
const i18n = useI18n();
</script>

<template>
	<span>
		<div v-if="!pushConnectionActive" class="push-connection-lost primary-color">
			<mage-tooltip placement="bottom-end">
				<template #content>
					<div v-mage-html="i18n.baseText('pushConnectionTracker.cannotConnectToServer')"></div>
				</template>
				<span>
					<font-awesome-icon icon="exclamation-triangle" />&nbsp;
					{{ i18n.baseText('pushConnectionTracker.connectionLost') }}
				</span>
			</mage-tooltip>
		</div>
		<slot v-else />
	</span>
</template>
