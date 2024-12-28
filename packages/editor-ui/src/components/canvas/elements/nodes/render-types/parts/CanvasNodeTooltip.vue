<script lang="ts" setup>
import { useCanvasNode } from '@/composables/useCanvasNode';
import { computed } from 'vue';
import type { CanvasNodeDefaultRender } from '@/types';

defineProps<{
	visible: boolean;
}>();

const { render } = useCanvasNode();

const renderOptions = computed(() => render.value.options as CanvasNodeDefaultRender['options']);
</script>

<template>
	<mageTooltip
		placement="top"
		:show-after="500"
		:visible="true"
		:teleported="false"
		:popper-class="$style.popper"
	>
		<template #content>
			{{ renderOptions.tooltip }}
		</template>
		<div :class="$style.tooltipTrigger" />
	</mageTooltip>
</template>

<style lang="scss" module>
.tooltipTrigger {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 1px;
}

.popper {
	white-space: nowrap;
}
</style>
