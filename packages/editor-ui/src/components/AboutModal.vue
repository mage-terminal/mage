<script setup lang="ts">
import { createEventBus } from 'mage-design-system/utils';
import Modal from './Modal.vue';
import { ABOUT_MODAL_KEY } from '../constants';
import { useRootStore } from '@/stores/root.store';
import { useToast } from '@/composables/useToast';
import { useClipboard } from '@/composables/useClipboard';
import { useDebugInfo } from '@/composables/useDebugInfo';
import { useI18n } from '@/composables/useI18n';

const modalBus = createEventBus();
const toast = useToast();
const i18n = useI18n();
const debugInfo = useDebugInfo();
const clipboard = useClipboard();
const rootStore = useRootStore();

const closeDialog = () => {
	modalBus.emit('close');
};

const copyDebugInfoToClipboard = async () => {
	toast.showToast({
		title: i18n.baseText('about.debug.toast.title'),
		message: i18n.baseText('about.debug.toast.message'),
		type: 'info',
		duration: 5000,
	});
	await clipboard.copy(debugInfo.generateDebugInfo());
};
</script>

<template>
	<Modal
		max-width="540px"
		:title="i18n.baseText('about.aboutmage')"
		:event-bus="modalBus"
		:name="ABOUT_MODAL_KEY"
		:center="true"
	>
		<template #content>
			<div :class="$style.container">
				<el-row>
					<el-col :span="8" class="info-name">
						<mage-text>{{ i18n.baseText('about.mageVersion') }}</mage-text>
					</el-col>
					<el-col :span="16">
						<mage-text>{{ rootStore.versionCli }}</mage-text>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8" class="info-name">
						<mage-text>{{ i18n.baseText('about.sourceCode') }}</mage-text>
					</el-col>
					<el-col :span="16">
						<mage-link to="https://github.com/mage-io/mage">https://github.com/mage-io/mage</mage-link>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8" class="info-name">
						<mage-text>{{ i18n.baseText('about.license') }}</mage-text>
					</el-col>
					<el-col :span="16">
						<mage-link to="https://github.com/mage-io/mage/blob/master/LICENSE.md">
							{{ i18n.baseText('about.mageLicense') }}
						</mage-link>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8" class="info-name">
						<mage-text>{{ i18n.baseText('about.instanceID') }}</mage-text>
					</el-col>
					<el-col :span="16">
						<mage-text>{{ rootStore.instanceId }}</mage-text>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8" class="info-name">
						<mage-text>{{ i18n.baseText('about.debug.title') }}</mage-text>
					</el-col>
					<el-col :span="16">
						<div :class="$style.debugInfo" @click="copyDebugInfoToClipboard">
							<mage-link>{{ i18n.baseText('about.debug.message') }}</mage-link>
						</div>
					</el-col>
				</el-row>
			</div>
		</template>

		<template #footer>
			<div class="action-buttons">
				<mage-button
					float="right"
					:label="i18n.baseText('about.close')"
					data-test-id="close-about-modal-button"
					@click="closeDialog"
				/>
			</div>
		</template>
	</Modal>
</template>

<style module lang="scss">
.container > * {
	margin-bottom: var(--spacing-s);
	overflow-wrap: break-word;
}
</style>
