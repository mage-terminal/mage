<script lang="ts" setup>
import { useI18n } from '@/composables/useI18n';
import Modal from '@/components/Modal.vue';

const props = defineProps<{
	modalName: string;
	data: { title: string; footerButtonAction: () => void };
}>();

const i18n = useI18n();
</script>

<template>
	<Modal width="500px" :title="props.data.title" :name="props.modalName">
		<template #content>
			<mage-text>
				{{ i18n.baseText('executionsList.debug.paywall.content') }}
				<br />
				<mage-link :to="i18n.baseText('executionsList.debug.paywall.link.url')" new-window>
					{{ i18n.baseText('executionsList.debug.paywall.link.text') }}
				</mage-link>
			</mage-text>
		</template>
		<template #footer>
			<div :class="$style.footer">
				<mage-button @click="props.data.footerButtonAction">
					{{ i18n.baseText('generic.seePlans') }}
				</mage-button>
			</div>
		</template>
	</Modal>
</template>

<style module lang="scss">
.footer {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
}
</style>
