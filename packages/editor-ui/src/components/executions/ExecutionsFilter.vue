<script lang="ts" setup>
import { computed, reactive, onBeforeMount, ref } from 'vue';
import type {
	ExecutionFilterType,
	ExecutionFilterMetadata,
	IWorkflowShortResponse,
	IWorkflowDb,
} from '@/Interface';
import { i18n as locale } from '@/plugins/i18n';
import { getObjectKeys, isEmpty } from '@/utils/typesUtils';
import { EnterpriseEditionFeature } from '@/constants';
import { useSettingsStore } from '@/stores/settings.store';
import { useTelemetry } from '@/composables/useTelemetry';
import type { Placement } from '@floating-ui/core';
import { useDebounce } from '@/composables/useDebounce';
import AnnotationTagsDropdown from '@/components/AnnotationTagsDropdown.ee.vue';
import { usePageRedirectionHelper } from '@/composables/usePageRedirectionHelper';

export type ExecutionFilterProps = {
	workflows?: Array<IWorkflowDb | IWorkflowShortResponse>;
	popoverPlacement?: Placement;
	teleported?: boolean;
};

const DATE_TIME_MASK = 'YYYY-MM-DD HH:mm';

const settingsStore = useSettingsStore();
const { debounce } = useDebounce();

const telemetry = useTelemetry();
const pageRedirectionHelper = usePageRedirectionHelper();

const props = withDefaults(defineProps<ExecutionFilterProps>(), {
	workflows: () => [] as Array<IWorkflowDb | IWorkflowShortResponse>,
	popoverPlacement: 'bottom' as Placement,
	teleported: true,
});
const emit = defineEmits<{
	filterChanged: [value: ExecutionFilterType];
}>();
const debouncedEmit = debounce(emit, {
	debounceTime: 500,
});

const isCustomDataFilterTracked = ref(false);
const isAdvancedExecutionFilterEnabled = computed(
	() => settingsStore.isEnterpriseFeatureEnabled[EnterpriseEditionFeature.AdvancedExecutionFilters],
);
const isAnnotationFiltersEnabled = computed(() => isAdvancedExecutionFilterEnabled.value);
const showTags = computed(() => false);

const getDefaultFilter = (): ExecutionFilterType => ({
	status: 'all',
	workflowId: 'all',
	tags: [],
	annotationTags: [],
	startDate: '',
	endDate: '',
	metadata: [{ key: '', value: '' }],
	vote: 'all',
});
const filter = reactive(getDefaultFilter());

// Automatically set up v-models based on filter properties
const vModel = reactive(
	getObjectKeys(filter).reduce(
		(acc, key) => {
			acc[key] = computed({
				get() {
					return filter[key];
				},
				set(value) {
					// TODO: find out what exactly is typechecker complaining about

					// @ts-ignore
					filter[key] = value;
					emit('filterChanged', filter);
				},
			});
			return acc;
		},
		{} as Record<keyof ExecutionFilterType, ReturnType<typeof computed>>,
	),
);

const statuses = computed(() => [
	{ id: 'all', name: locale.baseText('executionsList.anyStatus') },
	{ id: 'error', name: locale.baseText('executionsList.error') },
	{ id: 'canceled', name: locale.baseText('executionsList.canceled') },
	{ id: 'new', name: locale.baseText('executionsList.new') },
	{ id: 'running', name: locale.baseText('executionsList.running') },
	{ id: 'success', name: locale.baseText('executionsList.success') },
	{ id: 'waiting', name: locale.baseText('executionsList.waiting') },
]);

const voteFilterOptions = computed(() => [
	{ id: 'all', name: locale.baseText('executionsFilter.annotation.rating.all') },
	{ id: 'up', name: locale.baseText('executionsFilter.annotation.rating.good') },
	{ id: 'down', name: locale.baseText('executionsFilter.annotation.rating.bad') },
]);

const countSelectedFilterProps = computed(() => {
	const nonDefaultFilters = [
		filter.status !== 'all',
		filter.workflowId !== 'all' && props.workflows.length,
		!isEmpty(filter.tags),
		!isEmpty(filter.annotationTags),
		filter.vote !== 'all',
		!isEmpty(filter.metadata),
		!!filter.startDate,
		!!filter.endDate,
	].filter(Boolean);

	return nonDefaultFilters.length;
});

// vModel.metadata is a text input and needs a debounced emit to avoid too many requests
// We use the :value and @input combo instead of v-model with this event listener
const onFilterMetaChange = (index: number, prop: keyof ExecutionFilterMetadata, value: string) => {
	if (!filter.metadata[index]) {
		filter.metadata[index] = {
			key: '',
			value: '',
		};
	}
	filter.metadata[index][prop] = value;

	if (!isCustomDataFilterTracked.value) {
		telemetry.track('User filtered executions with custom data');
		isCustomDataFilterTracked.value = true;
	}

	debouncedEmit('filterChanged', filter);
};

// Can't use v-model on TagsDropdown component and thus vModel.tags is useless
// We just emit the updated filter
const onTagsChange = () => {
	emit('filterChanged', filter);
};

const onAnnotationTagsChange = () => {
	emit('filterChanged', filter);
};

const onFilterReset = () => {
	Object.assign(filter, getDefaultFilter());
	emit('filterChanged', filter);
};

const goToUpgrade = () => {
	void pageRedirectionHelper.goToUpgrade('custom-data-filter', 'upgrade-custom-data-filter');
};

onBeforeMount(() => {
	isCustomDataFilterTracked.value = false;
});
</script>
<template>
	<mage-popover trigger="click" :placement="popoverPlacement" width="440">
		<template #reference>
			<mage-button
				icon="filter"
				type="tertiary"
				:active="!!countSelectedFilterProps"
				data-test-id="executions-filter-button"
			>
				<mage-badge
					v-if="!!countSelectedFilterProps"
					theme="primary"
					class="mr-4xs"
					data-test-id="execution-filter-badge"
					>{{ countSelectedFilterProps }}</mage-badge
				>
				{{ locale.baseText('executionsList.filters') }}
			</mage-button>
		</template>
		<div data-test-id="execution-filter-form">
			<div v-if="workflows && workflows.length > 0" :class="$style.group">
				<label for="execution-filter-workflows">{{ locale.baseText('workflows.heading') }}</label>
				<mage-select
					id="execution-filter-workflows"
					v-model="vModel.workflowId"
					:placeholder="locale.baseText('executionsFilter.selectWorkflow')"
					filterable
					data-test-id="executions-filter-workflows-select"
					:teleported="teleported"
				>
					<div>
						<mage-option
							v-for="(item, idx) in props.workflows"
							:key="idx"
							:label="item.name"
							:value="item.id"
						/>
					</div>
				</mage-select>
			</div>
			<div v-if="showTags" :class="$style.group">
				<label for="execution-filter-tags">{{ locale.baseText('workflows.filters.tags') }}</label>
				<WorkflowTagsDropdown
					id="execution-filter-tags"
					v-model="filter.tags"
					:placeholder="locale.baseText('workflowOpen.filterWorkflows')"
					:create-enabled="false"
					data-test-id="executions-filter-tags-select"
					@update:model-value="onTagsChange"
				/>
			</div>
			<div :class="$style.group">
				<label for="execution-filter-status">{{ locale.baseText('executionsList.status') }}</label>
				<mage-select
					id="execution-filter-status"
					v-model="vModel.status"
					:placeholder="locale.baseText('executionsFilter.selectStatus')"
					filterable
					data-test-id="executions-filter-status-select"
					:teleported="teleported"
				>
					<mage-option
						v-for="(item, idx) in statuses"
						:key="idx"
						:label="item.name"
						:value="item.id"
					/>
				</mage-select>
			</div>
			<div :class="$style.group">
				<label for="execution-filter-start-date">{{
					locale.baseText('executionsFilter.start')
				}}</label>
				<div :class="$style.dates">
					<el-date-picker
						id="execution-filter-start-date"
						v-model="vModel.startDate"
						type="datetime"
						:teleported="false"
						:format="DATE_TIME_MASK"
						:placeholder="locale.baseText('executionsFilter.startDate')"
						data-test-id="executions-filter-start-date-picker"
					/>
					<span :class="$style.divider">to</span>
					<el-date-picker
						id="execution-filter-end-date"
						v-model="vModel.endDate"
						type="datetime"
						:teleported="false"
						:format="DATE_TIME_MASK"
						:placeholder="locale.baseText('executionsFilter.endDate')"
						data-test-id="executions-filter-end-date-picker"
					/>
				</div>
			</div>
			<div v-if="isAnnotationFiltersEnabled" :class="$style.group">
				<label for="execution-filter-annotation-tags">{{
					locale.baseText('executionsFilter.annotation.tags')
				}}</label>
				<AnnotationTagsDropdown
					id="execution-filter-annotation-tags"
					:placeholder="locale.baseText('workflowOpen.filterWorkflows')"
					v-model="filter.annotationTags"
					:create-enabled="false"
					data-test-id="executions-filter-annotation-tags-select"
					@update:model-value="onAnnotationTagsChange"
				/>
			</div>
			<div v-if="isAnnotationFiltersEnabled" :class="$style.group">
				<label for="execution-filter-annotation-vote">{{
					locale.baseText('executionsFilter.annotation.rating')
				}}</label>
				<mage-select
					id="execution-filter-annotation-vote"
					v-model="vModel.vote"
					:placeholder="locale.baseText('executionsFilter.annotation.selectVoteFilter')"
					filterable
					data-test-id="executions-filter-annotation-vote-select"
					:teleported="teleported"
				>
					<mage-option
						v-for="(item, idx) in voteFilterOptions"
						:key="idx"
						:label="item.name"
						:value="item.id"
					/>
				</mage-select>
			</div>
			<div :class="$style.group">
				<mage-tooltip placement="right">
					<template #content>
						<i18n-t tag="span" keypath="executionsFilter.customData.docsTooltip" />
					</template>
					<span :class="$style.label">
						{{ locale.baseText('executionsFilter.savedData') }}
						<mage-icon :class="$style.tooltipIcon" icon="question-circle" size="small" />
					</span>
				</mage-tooltip>
				<div :class="$style.subGroup">
					<label for="execution-filter-saved-data-key">{{
						locale.baseText('executionsFilter.savedDataKey')
					}}</label>
					<mage-tooltip :disabled="isAdvancedExecutionFilterEnabled" placement="top">
						<template #content>
							<i18n-t tag="span" keypath="executionsFilter.customData.inputTooltip">
								<template #link>
									<a
										href="#"
										data-test-id="executions-filter-view-plans-link"
										@click.prevent="goToUpgrade"
										>{{ locale.baseText('executionsFilter.customData.inputTooltip.link') }}</a
									>
								</template>
							</i18n-t>
						</template>
						<mage-input
							id="execution-filter-saved-data-key"
							name="execution-filter-saved-data-key"
							type="text"
							:disabled="!isAdvancedExecutionFilterEnabled"
							:placeholder="locale.baseText('executionsFilter.savedDataKeyPlaceholder')"
							:model-value="filter.metadata[0]?.key"
							data-test-id="execution-filter-saved-data-key-input"
							@update:model-value="onFilterMetaChange(0, 'key', $event)"
						/>
					</mage-tooltip>
					<label for="execution-filter-saved-data-value">{{
						locale.baseText('executionsFilter.savedDataValue')
					}}</label>
					<mage-tooltip :disabled="isAdvancedExecutionFilterEnabled" placement="top">
						<template #content>
							<i18n-t tag="span" keypath="executionsFilter.customData.inputTooltip">
								<template #link>
									<a href="#" @click.prevent="goToUpgrade">{{
										locale.baseText('executionsFilter.customData.inputTooltip.link')
									}}</a>
								</template>
							</i18n-t>
						</template>
						<mage-input
							id="execution-filter-saved-data-value"
							name="execution-filter-saved-data-value"
							type="text"
							:disabled="!isAdvancedExecutionFilterEnabled"
							:placeholder="locale.baseText('executionsFilter.savedDataValuePlaceholder')"
							:model-value="filter.metadata[0]?.value"
							data-test-id="execution-filter-saved-data-value-input"
							@update:model-value="onFilterMetaChange(0, 'value', $event)"
						/>
					</mage-tooltip>
				</div>
			</div>
			<mage-button
				v-if="!!countSelectedFilterProps"
				:class="$style.resetBtn"
				size="large"
				text
				data-test-id="executions-filter-reset-button"
				@click="onFilterReset"
			>
				{{ locale.baseText('executionsFilter.reset') }}
			</mage-button>
		</div>
	</mage-popover>
</template>
<style lang="scss" module>
.group {
	label,
	.label {
		display: inline-block;
		font-size: var(--font-size-2xs);
		margin: var(--spacing-s) 0 var(--spacing-3xs);
	}
}

.subGroup {
	padding: 0 0 var(--spacing-xs) var(--spacing-s);

	label,
	.label {
		font-size: var(--font-size-3xs);
		margin: var(--spacing-4xs) 0 var(--spacing-4xs);
	}
}

.dates {
	display: flex;
	border: 1px solid var(--color-foreground-base);
	border-radius: var(--border-radius-base);
	white-space: nowrap;
	align-items: center;
}

.divider {
	padding: 0 var(--spacing-m);
	line-height: 100%;
}

.resetBtn {
	padding: 0;
	margin: var(--spacing-xs) 0 0;
}

.tooltipIcon {
	color: var(--color-text-light);
}
</style>

<style lang="scss" scoped>
:deep(.el-date-editor) {
	input {
		height: 36px;
		border: 0;
		padding-right: 0;
	}

	.el-input__prefix {
		color: var(--color-foreground-dark);
	}

	&:last-of-type {
		input {
			padding-left: 0;
		}

		.el-input__prefix {
			display: none;
		}
	}
}

:deep(.el-select-dropdown.el-popper[data-popper-placement^='bottom']) {
	> .popper__arrow {
		top: -6px;
		left: 50%;
		right: unset;
		margin-bottom: 0;
		margin-right: 3px;
		border-left-width: 6px;
		border-top-width: 0;
		border-bottom-color: var(--border-color-light);
		border-right-color: transparent;

		&::after {
			top: 1px;
			left: unset;
			bottom: unset;
			margin-left: -6px;
			border-left-width: 6px;
			border-top-width: 0;
			border-bottom-color: var(--color-foreground-xlight);
			border-right-color: transparent;
		}
	}
}
</style>
