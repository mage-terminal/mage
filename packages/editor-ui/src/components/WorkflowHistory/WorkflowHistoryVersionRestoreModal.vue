<script lang="ts" setup>
import { useI18n } from '@/composables/useI18n';
import Modal from '@/components/Modal.vue';
import { useUIStore } from '@/stores/ui.store';

const props = defineProps<{
	modalName: string;
	data: {
		isWorkflowActivated: boolean;
		formattedCreatedAt: string;
		beforeClose: () => void;
		buttons: Array<{
			text: string;
			type: string;
			action: () => void;
		}>;
	};
}>();

const i18n = useI18n();
const uiStore = useUIStore();

const closeModal = () => {
	uiStore.closeModal(props.modalName);
};
</script>

<template>
	<Modal width="500px" :name="props.modalName" :before-close="props.data.beforeClose">
		<template #header>
			<mage-heading tag="h2" size="xlarge">
				{{ i18n.baseText('workflowHistory.action.restore.modal.title') }}
			</mage-heading>
		</template>
		<template #content>
			<div>
				<mage-text>
					<i18n-t keypath="workflowHistory.action.restore.modal.subtitle" tag="span">
						<template #date>
							<strong>{{ props.data.formattedCreatedAt }}</strong>
						</template>
					</i18n-t>
					<br />
					<br />
					<i18n-t
						v-if="props.data.isWorkflowActivated"
						keypath="workflowHistory.action.restore.modal.text"
						tag="span"
					>
						<template #buttonText>
							&ldquo;{{
								i18n.baseText('workflowHistory.action.restore.modal.button.deactivateAndRestore')
							}}&rdquo;
						</template>
					</i18n-t>
				</mage-text>
			</div>
		</template>
		<template #footer>
			<div :class="$style.footer">
				<mage-button
					v-for="(button, index) in props.data.buttons"
					:key="index"
					size="medium"
					:type="button.type"
					@click="
						() => {
							button.action();
							closeModal();
						}
					"
				>
					{{ button.text }}
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

	button {
		margin-left: var(--spacing-2xs);
	}
}
</style>
