<script lang="ts" setup>
defineProps<{
	title: string;
}>();
</script>

<template>
	<div :class="$style.block">
		<div :class="$style.header">
			<mage-heading tag="h3" size="small" color="text-base">{{ title }}</mage-heading>
		</div>
		<div :class="$style.content">
			<slot></slot>
		</div>
	</div>
</template>

<style lang="scss" module>
.block {
	padding-bottom: var(--spacing-xl);
}

.header {
	padding: 0 0 var(--spacing-4xs);
	border-bottom: var(--border-base);
}

.content {
	padding: var(--spacing-xs) 0 0;
}
</style>
