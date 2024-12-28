<script setup lang="ts">
import type { KeyboardShortcut } from '@/Interface';
import type { Placement } from 'element-plus';

interface Props {
	label: string;
	shortcut?: KeyboardShortcut;
	placement?: Placement;
}
withDefaults(defineProps<Props>(), { placement: 'top', shortcut: undefined });
</script>

<template>
	<mage-tooltip :placement="placement" :show-after="500">
		<template #content>
			<div :class="$style.shortcut">
				<div :class="$style.label">{{ label }}</div>
				<mage-keyboard-shortcut v-if="shortcut" v-bind="shortcut" />
			</div>
		</template>
		<slot />
	</mage-tooltip>
</template>

<style lang="scss" module>
.shortcut {
	display: flex;
	align-items: center;
	font-size: var(--font-size-2xs);
	gap: var(--spacing-2xs);
}

.label {
	flex-shrink: 0;
}
</style>
