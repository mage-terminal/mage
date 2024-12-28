<script setup lang="ts">
import type { AnnotationVote } from 'mage-workflow';

defineProps<{
	vote: AnnotationVote | null;
}>();

const emit = defineEmits<{
	'vote-click': [vote: AnnotationVote];
}>();

const onVoteClick = (vote: AnnotationVote) => {
	emit('vote-click', vote);
};
</script>

<template>
	<div :class="$style.ratingIcon">
		<mage-icon-button
			:class="{ [$style.up]: vote === 'up' }"
			type="tertiary"
			text
			size="medium"
			icon="thumbs-up"
			@click="onVoteClick('up')"
		/>
		<mage-icon-button
			:class="{ [$style.down]: vote === 'down' }"
			type="tertiary"
			text
			size="medium"
			icon="thumbs-down"
			@click="onVoteClick('down')"
		/>
	</div>
</template>

<style module lang="scss">
.ratingIcon {
	display: flex;
	flex-direction: row;

	.up {
		color: var(--color-success);
	}

	.down {
		color: var(--color-danger);
	}
}
</style>
