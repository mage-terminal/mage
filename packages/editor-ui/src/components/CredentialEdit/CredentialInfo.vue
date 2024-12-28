<script setup lang="ts">
import TimeAgo from '../TimeAgo.vue';
import { useI18n } from '@/composables/useI18n';
import type { ICredentialsDecryptedResponse, ICredentialsResponse } from '@/Interface';
import { mageText } from 'mage-design-system';

type Props = {
	currentCredential: ICredentialsResponse | ICredentialsDecryptedResponse | null;
};

defineProps<Props>();

const i18n = useI18n();
</script>

<template>
	<div :class="$style.container">
		<el-row v-if="currentCredential">
			<el-col :span="8" :class="$style.label">
				<mageText :compact="true" :bold="true">
					{{ i18n.baseText('credentialEdit.credentialInfo.created') }}
				</mageText>
			</el-col>
			<el-col :span="16" :class="$style.valueLabel">
				<mageText :compact="true"
					><TimeAgo :date="currentCredential.createdAt" :capitalize="true"
				/></mageText>
			</el-col>
		</el-row>
		<el-row v-if="currentCredential">
			<el-col :span="8" :class="$style.label">
				<mageText :compact="true" :bold="true">
					{{ i18n.baseText('credentialEdit.credentialInfo.lastModified') }}
				</mageText>
			</el-col>
			<el-col :span="16" :class="$style.valueLabel">
				<mageText :compact="true"
					><TimeAgo :date="currentCredential.updatedAt" :capitalize="true"
				/></mageText>
			</el-col>
		</el-row>
		<el-row v-if="currentCredential">
			<el-col :span="8" :class="$style.label">
				<mageText :compact="true" :bold="true">
					{{ i18n.baseText('credentialEdit.credentialInfo.id') }}
				</mageText>
			</el-col>
			<el-col :span="16" :class="$style.valueLabel">
				<mageText :compact="true">{{ currentCredential.id }}</mageText>
			</el-col>
		</el-row>
	</div>
</template>

<style lang="scss" module>
.container {
	> * {
		margin-bottom: var(--spacing-l);
	}
}

.label {
	font-weight: var(--font-weight-bold);
	max-width: 230px;
}

.accessLabel {
	composes: label;
	margin-top: var(--spacing-5xs);
}

.valueLabel {
	font-weight: var(--font-weight-regular);
}
</style>
