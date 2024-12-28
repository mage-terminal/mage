<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import type { IExecutionUIData } from '@/composables/useExecutionHelpers';
import { EnterpriseEditionFeature, VIEWS } from '@/constants';
import ExecutionsTime from '@/components/executions/ExecutionsTime.vue';
import { useExecutionHelpers } from '@/composables/useExecutionHelpers';
import type { ExecutionSummary } from 'mage-workflow';
import { useWorkflowsStore } from '@/stores/workflows.store';
import { useI18n } from '@/composables/useI18n';
import type { PermissionsRecord } from '@/permissions';
import { useSettingsStore } from '@/stores/settings.store';
import { toDayMonth, toTime } from '@/utils/formatters/dateFormatter';

const props = defineProps<{
	execution: ExecutionSummary;
	highlight?: boolean;
	showGap?: boolean;
	workflowPermissions: PermissionsRecord['workflow'];
}>();

const emit = defineEmits<{
	retryExecution: [{ execution: ExecutionSummary; command: string }];
	mounted: [string];
}>();

const route = useRoute();
const locale = useI18n();

const executionHelpers = useExecutionHelpers();
const workflowsStore = useWorkflowsStore();
const settingsStore = useSettingsStore();

const isAdvancedExecutionFilterEnabled = computed(
	() => settingsStore.isEnterpriseFeatureEnabled[EnterpriseEditionFeature.AdvancedExecutionFilters],
);
const isAnnotationEnabled = computed(() => isAdvancedExecutionFilterEnabled.value);

const currentWorkflow = computed(() => (route.params.name as string) || workflowsStore.workflowId);
const retryExecutionActions = computed(() => [
	{
		id: 'current-workflow',
		label: locale.baseText('executionsList.retryWithCurrentlySavedWorkflow'),
	},
	{
		id: 'original-workflow',
		label: locale.baseText('executionsList.retryWithOriginalWorkflow'),
	},
]);
const executionUIDetails = computed<IExecutionUIData>(() =>
	executionHelpers.getUIDetails(props.execution),
);
const isActive = computed(() => props.execution.id === route.params.executionId);
const isRetriable = computed(() => executionHelpers.isExecutionRetriable(props.execution));

onMounted(() => {
	emit('mounted', props.execution.id);
});

function onRetryMenuItemSelect(action: string): void {
	emit('retryExecution', { execution: props.execution, command: action });
}
</script>

<template>
	<div
		:class="{
			['execution-card']: true,
			[$style.WorkflowExecutionsCard]: true,
			[$style.active]: isActive,
			[$style[executionUIDetails.name]]: true,
			[$style.highlight]: highlight,
			[$style.showGap]: showGap,
		}"
	>
		<router-link
			:class="$style.executionLink"
			:to="{
				name: VIEWS.EXECUTION_PREVIEW,
				params: { name: currentWorkflow, executionId: execution.id },
			}"
			:data-test-execution-status="executionUIDetails.name"
		>
			<div :class="$style.description">
				<mageText
					v-if="executionUIDetails.name === 'new'"
					color="text-dark"
					:bold="true"
					size="medium"
					data-test-id="execution-time"
				>
					{{ toDayMonth(executionUIDetails.createdAt) }} -
					{{ locale.baseText('executionDetails.startingSoon') }}
				</mageText>
				<mageText v-else color="text-dark" :bold="true" size="medium" data-test-id="execution-time">
					{{ executionUIDetails.startTime }}
				</mageText>
				<div :class="$style.executionStatus">
					<mageSpinner
						v-if="executionUIDetails.name === 'running'"
						size="small"
						:class="[$style.spinner, 'mr-4xs']"
					/>
					<mageText :class="$style.statusLabel" size="small">{{ executionUIDetails.label }}</mageText>
					{{ ' ' }}
					<mageText
						v-if="executionUIDetails.name === 'running'"
						:color="isActive ? 'text-dark' : 'text-base'"
						size="small"
					>
						{{ locale.baseText('executionDetails.runningTimeRunning') }}
						<ExecutionsTime :start-time="execution.startedAt" />
					</mageText>
					<mageText
						v-if="executionUIDetails.name === 'new' && execution.createdAt"
						:color="isActive ? 'text-dark' : 'text-base'"
						size="small"
					>
						<span
							>{{ locale.baseText('executionDetails.at') }} {{ toTime(execution.createdAt) }}</span
						>
					</mageText>
					<mageText
						v-else-if="executionUIDetails.runningTime !== ''"
						:color="isActive ? 'text-dark' : 'text-base'"
						size="small"
					>
						{{
							locale.baseText('executionDetails.runningTimeFinished', {
								interpolate: { time: executionUIDetails?.runningTime },
							})
						}}
					</mageText>
				</div>
				<div v-if="execution.mode === 'retry'">
					<mageText :color="isActive ? 'text-dark' : 'text-base'" size="small">
						{{ locale.baseText('executionDetails.retry') }} #{{ execution.retryOf }}
					</mageText>
				</div>
				<div v-if="isAnnotationEnabled" :class="$style.annotation">
					<div v-if="execution.annotation?.vote" :class="$style.ratingIcon">
						<FontAwesomeIcon
							v-if="execution.annotation.vote == 'up'"
							:class="$style.up"
							icon="thumbs-up"
						/>
						<FontAwesomeIcon v-else :class="$style.down" icon="thumbs-down" />
					</div>
					<mageTags
						v-if="executionUIDetails.tags.length > 0"
						:tags="executionUIDetails.tags"
						:clickable="false"
					></mageTags>
				</div>
			</div>
			<div :class="$style.icons">
				<mageActionDropdown
					v-if="isRetriable"
					:class="[$style.icon, $style.retry]"
					:items="retryExecutionActions"
					:disabled="!workflowPermissions.execute"
					activator-icon="redo"
					data-test-id="retry-execution-button"
					@select="onRetryMenuItemSelect"
				/>
				<mageTooltip v-if="execution.mode === 'manual'" placement="top">
					<template #content>
						<span>{{ locale.baseText('executionsList.test') }}</span>
					</template>
					<FontAwesomeIcon
						v-if="execution.mode === 'manual'"
						:class="[$style.icon, $style.manual]"
						icon="flask"
					/>
				</mageTooltip>
			</div>
		</router-link>
	</div>
</template>

<style module lang="scss">
@import '@/styles/variables';

.WorkflowExecutionsCard {
	--execution-list-item-background: var(--color-foreground-xlight);
	--execution-list-item-highlight-background: var(--color-warning-tint-1);

	display: flex;
	flex-direction: column;
	padding-right: var(--spacing-m);

	&.active {
		border-left: var(--spacing-4xs) var(--border-style-base) transparent !important;

		.executionStatus {
			color: var(--color-text-dark) !important;
		}
	}

	&:hover,
	&.active {
		.executionLink {
			--execution-list-item-background: var(--color-foreground-light);
		}
	}

	&.new,
	&.running {
		.spinner {
			position: relative;
			top: 1px;
		}
		&,
		& .executionLink {
			border-left: var(--spacing-4xs) var(--border-style-base) var(--execution-card-border-running);
		}
		.statusLabel,
		.spinner {
			color: var(--color-warning);
		}
	}

	&.success {
		&,
		& .executionLink {
			border-left: var(--spacing-4xs) var(--border-style-base) var(--execution-card-border-success);
		}
	}

	&.new {
		&,
		& .executionLink {
			border-left: var(--spacing-4xs) var(--border-style-base) var(--execution-card-border-waiting);
		}
		.statusLabel {
			color: var(--execution-card-text-waiting);
		}
	}

	&.waiting {
		&,
		& .executionLink {
			border-left: var(--spacing-4xs) var(--border-style-base) var(--execution-card-border-waiting);
		}
		.statusLabel {
			color: var(--color-secondary);
		}
	}

	&.error {
		&,
		& .executionLink {
			border-left: var(--spacing-4xs) var(--border-style-base) var(--execution-card-border-error);
		}
		.statusLabel {
			color: var(--color-danger);
		}
	}

	&.unknown {
		&,
		& .executionLink {
			border-left: var(--spacing-4xs) var(--border-style-base) var(--execution-card-border-unknown);
		}
	}

	.annotation {
		display: flex;
		flex-direction: row;
		gap: var(--spacing-3xs);
		align-items: center;
		margin: var(--spacing-4xs) 0 0;

		.ratingIcon {
			.up {
				color: var(--color-success);
			}
			.down {
				color: var(--color-danger);
			}
		}
	}
}

.executionLink {
	background: var(--execution-list-item-background);
	display: flex;
	width: 100%;
	align-items: center;
	justify-content: space-between;
	color: var(--color-text-base);
	font-size: var(--font-size-xs);
	padding: var(--spacing-xs);
	padding-right: var(--spacing-s);
	position: relative;
	left: calc(
		-1 * var(--spacing-4xs)
	); // Hide link border under card border so it's not visible when not hovered

	&:active {
		.icon,
		.statusLabel {
			color: var(--color-text-base);
		}
	}
}

.icons {
	display: flex;
	align-items: center;
}

.icon {
	font-size: var(--font-size-s);

	&.retry {
		svg {
			color: var(--color-primary);
		}
	}

	&.manual {
		position: relative;
		top: 1px;
	}

	& + & {
		margin-left: var(--spacing-2xs);
	}
}

.showGap {
	margin-bottom: var(--spacing-2xs);
	.executionLink {
		border-bottom: 1px solid var(--color-foreground-dark);
	}
}
</style>
