<script lang="ts" setup>
import { mageIconButton, mageActionToggle } from 'mage-design-system';

type Action = {
	label: string;
	value: string;
	disabled: boolean;
};
defineProps<{
	actions: Action[];
}>();

const emit = defineEmits<{
	action: [id: string];
}>();
</script>

<template>
	<div :class="[$style.buttonGroup]">
		<slot></slot>
		<mageActionToggle
			data-test-id="add-resource"
			:actions="actions"
			placement="bottom-end"
			:teleported="false"
			@action="emit('action', $event)"
		>
			<mageIconButton :class="[$style.buttonGroupDropdown]" icon="angle-down" />
		</mageActionToggle>
	</div>
</template>

<style lang="scss" module>
.buttonGroup {
	display: inline-flex;

	:global(> .button) {
		border-right: 1px solid var(--button-font-color, var(--color-button-primary-font));

		&:not(:first-child) {
			border-radius: 0;
		}

		&:first-child {
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		}
	}
}

.buttonGroupDropdown {
	border-top-left-radius: 0;
	border-bottom-left-radius: 0;
}
</style>
