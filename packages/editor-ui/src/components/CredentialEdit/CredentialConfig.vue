<script setup lang="ts">
import { computed, onBeforeMount, watch } from 'vue';

import { getAppNameFromCredType, isCommunityPackageName } from '@/utils/nodeTypesUtils';
import type {
	ICredentialDataDecryptedObject,
	ICredentialType,
	INodeProperties,
} from 'mage-workflow';

import type { IUpdateInformation } from '@/Interface';
import AuthTypeSelector from '@/components/CredentialEdit/AuthTypeSelector.vue';
import EnterpriseEdition from '@/components/EnterpriseEdition.ee.vue';
import { useI18n } from '@/composables/useI18n';
import { useTelemetry } from '@/composables/useTelemetry';
import {
	BUILTIN_CREDENTIALS_DOCS_URL,
	CREDENTIAL_DOCS_EXPERIMENT,
	DOCS_DOMAIN,
	EnterpriseEditionFeature,
	NEW_ASSISTANT_SESSION_MODAL,
} from '@/constants';
import type { PermissionsRecord } from '@/permissions';
import { addCredentialTranslation } from '@/plugins/i18n';
import { useCredentialsStore } from '@/stores/credentials.store';
import { useNDVStore } from '@/stores/ndv.store';
import { useRootStore } from '@/stores/root.store';
import { useUIStore } from '@/stores/ui.store';
import { useWorkflowsStore } from '@/stores/workflows.store';
import Banner from '../Banner.vue';
import CopyInput from '../CopyInput.vue';
import CredentialInputs from './CredentialInputs.vue';
import GoogleAuthButton from './GoogleAuthButton.vue';
import OauthButton from './OauthButton.vue';
import CredentialDocs from './CredentialDocs.vue';
import { CREDENTIAL_MARKDOWN_DOCS } from './docs';
import { usePostHog } from '@/stores/posthog.store';
import { useAssistantStore } from '@/stores/assistant.store';
import InlineAskAssistantButton from 'mage-design-system/components/InlineAskAssistantButton/InlineAskAssistantButton.vue';

type Props = {
	mode: string;
	credentialType: ICredentialType;
	credentialProperties: INodeProperties[];
	credentialData: ICredentialDataDecryptedObject;
	credentialId?: string;
	credentialPermissions: PermissionsRecord['credential'];
	parentTypes?: string[];
	showValidationWarning?: boolean;
	authError?: string;
	testedSuccessfully?: boolean;
	isOAuthType?: boolean;
	allOAuth2BasePropertiesOverridden?: boolean;
	isOAuthConnected?: boolean;
	isRetesting?: boolean;
	requiredPropertiesFilled?: boolean;
	showAuthTypeSelector?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
	parentTypes: () => [],
	credentialId: '',
	authError: '',
	showValidationWarning: false,
	credentialPermissions: () => ({}) as PermissionsRecord['credential'],
});
const emit = defineEmits<{
	update: [value: IUpdateInformation];
	authTypeChanged: [value: string];
	scrollToTop: [];
	retest: [];
	oauth: [];
}>();

const credentialsStore = useCredentialsStore();
const ndvStore = useNDVStore();
const rootStore = useRootStore();
const uiStore = useUIStore();
const workflowsStore = useWorkflowsStore();
const assistantStore = useAssistantStore();

const i18n = useI18n();
const telemetry = useTelemetry();

onBeforeMount(async () => {
	uiStore.activeCredentialType = props.credentialType.name;

	if (rootStore.defaultLocale === 'en') return;

	const key = `mage-nodes-base.credentials.${props.credentialType.name}`;

	if (i18n.exists(key)) return;

	const credTranslation = await credentialsStore.getCredentialTranslation(
		props.credentialType.name,
	);

	addCredentialTranslation(
		{ [props.credentialType.name]: credTranslation },
		rootStore.defaultLocale,
	);
});

const appName = computed(() => {
	if (!props.credentialType) {
		return '';
	}

	return (
		getAppNameFromCredType(props.credentialType.displayName) ||
		i18n.baseText('credentialEdit.credentialConfig.theServiceYouReConnectingTo')
	);
});
const credentialTypeName = computed(() => props.credentialType?.name);
const credentialOwnerName = computed(() =>
	credentialsStore.getCredentialOwnerNameById(`${props.credentialId}`),
);
const documentationUrl = computed(() => {
	const type = props.credentialType;
	const activeNode = ndvStore.activeNode;
	const isCommunityNode = activeNode ? isCommunityPackageName(activeNode.type) : false;

	const docUrl = type?.documentationUrl;

	if (!docUrl) {
		return '';
	}

	let url: URL;
	if (docUrl.startsWith('https://') || docUrl.startsWith('http://')) {
		url = new URL(docUrl);
		if (url.hostname !== DOCS_DOMAIN) return docUrl;
	} else {
		// Don't show documentation link for community nodes if the URL is not an absolute path
		if (isCommunityNode) return '';
		else url = new URL(`${BUILTIN_CREDENTIALS_DOCS_URL}${docUrl}/`);
	}

	if (url.hostname === DOCS_DOMAIN) {
		url.searchParams.set('utm_source', 'mage_app');
		url.searchParams.set('utm_medium', 'credential_settings');
		url.searchParams.set('utm_campaign', 'create_new_credentials_modal');
	}

	return url.href;
});

const isGoogleOAuthType = computed(
	() =>
		credentialTypeName.value === 'googleOAuth2Api' || props.parentTypes.includes('googleOAuth2Api'),
);

const oAuthCallbackUrl = computed(() => {
	const oauthType =
		credentialTypeName.value === 'oAuth2Api' || props.parentTypes.includes('oAuth2Api')
			? 'oauth2'
			: 'oauth1';
	return rootStore.OAuthCallbackUrls[oauthType as keyof {}];
});

const showOAuthSuccessBanner = computed(() => {
	return (
		props.isOAuthType &&
		props.requiredPropertiesFilled &&
		props.isOAuthConnected &&
		!props.authError
	);
});

const isMissingCredentials = computed(() => props.credentialType === null);

const isNewCredential = computed(() => props.mode === 'new' && !props.credentialId);

const isAskAssistantAvailable = computed(
	() =>
		documentationUrl.value &&
		documentationUrl.value.includes(DOCS_DOMAIN) &&
		props.credentialProperties.length &&
		props.credentialPermissions.update &&
		!(props.isOAuthType && props.requiredPropertiesFilled) &&
		assistantStore.isAssistantEnabled,
);

const assistantAlreadyAsked = computed<boolean>(() => {
	return assistantStore.isCredTypeActive(props.credentialType);
});

const docs = computed(() => CREDENTIAL_MARKDOWN_DOCS[props.credentialType.name]);
const showCredentialDocs = computed(
	() =>
		usePostHog().getVariant(CREDENTIAL_DOCS_EXPERIMENT.name) ===
			CREDENTIAL_DOCS_EXPERIMENT.variant && docs.value,
);

function onDataChange(event: IUpdateInformation): void {
	emit('update', event);
}

function onDocumentationUrlClick(): void {
	telemetry.track('User clicked credential modal docs link', {
		docs_link: documentationUrl.value,
		credential_type: credentialTypeName.value,
		source: 'modal',
		workflow_id: workflowsStore.workflowId,
	});
}

function onAuthTypeChange(newType: string): void {
	emit('authTypeChanged', newType);
}

async function onAskAssistantClick() {
	const sessionInProgress = !assistantStore.isSessionEnded;
	if (sessionInProgress) {
		uiStore.openModalWithData({
			name: NEW_ASSISTANT_SESSION_MODAL,
			data: {
				context: {
					credHelp: {
						credType: props.credentialType,
					},
				},
			},
		});
		return;
	}
	await assistantStore.initCredHelp(props.credentialType);
}

watch(showOAuthSuccessBanner, (newValue, oldValue) => {
	if (newValue && !oldValue) {
		emit('scrollToTop');
	}
});
</script>

<template>
	<div>
		<div :class="$style.config" data-test-id="node-credentials-config-container">
			<Banner
				v-show="showValidationWarning"
				theme="danger"
				:message="
					i18n.baseText(
						`credentialEdit.credentialConfig.pleaseCheckTheErrorsBelow${
							credentialPermissions.update ? '' : '.sharee'
						}`,
						{ interpolate: { owner: credentialOwnerName } },
					)
				"
			/>

			<Banner
				v-if="authError && !showValidationWarning"
				theme="danger"
				:message="
					i18n.baseText(
						`credentialEdit.credentialConfig.couldntConnectWithTheseSettings${
							credentialPermissions.update ? '' : '.sharee'
						}`,
						{ interpolate: { owner: credentialOwnerName } },
					)
				"
				:details="authError"
				:button-label="i18n.baseText('credentialEdit.credentialConfig.retry')"
				button-loading-label="Retrying"
				:button-title="i18n.baseText('credentialEdit.credentialConfig.retryCredentialTest')"
				:button-loading="isRetesting"
				@click="$emit('retest')"
			/>

			<Banner
				v-show="showOAuthSuccessBanner && !showValidationWarning"
				theme="success"
				:message="i18n.baseText('credentialEdit.credentialConfig.accountConnected')"
				:button-label="i18n.baseText('credentialEdit.credentialConfig.reconnect')"
				:button-title="i18n.baseText('credentialEdit.credentialConfig.reconnectOAuth2Credential')"
				data-test-id="oauth-connect-success-banner"
				@click="$emit('oauth')"
			>
				<template v-if="isGoogleOAuthType" #button>
					<p
						:class="$style.googleReconnectLabel"
						v-text="`${i18n.baseText('credentialEdit.credentialConfig.reconnect')}:`"
					/>
					<GoogleAuthButton @click="$emit('oauth')" />
				</template>
			</Banner>

			<Banner
				v-show="testedSuccessfully && !showValidationWarning"
				theme="success"
				:message="i18n.baseText('credentialEdit.credentialConfig.connectionTestedSuccessfully')"
				:button-label="i18n.baseText('credentialEdit.credentialConfig.retry')"
				:button-loading-label="i18n.baseText('credentialEdit.credentialConfig.retrying')"
				:button-title="i18n.baseText('credentialEdit.credentialConfig.retryCredentialTest')"
				:button-loading="isRetesting"
				data-test-id="credentials-config-container-test-success"
				@click="$emit('retest')"
			/>

			<template v-if="credentialPermissions.update">
				<mage-notice
					v-if="documentationUrl && credentialProperties.length && !showCredentialDocs"
					theme="warning"
				>
					{{ i18n.baseText('credentialEdit.credentialConfig.needHelpFillingOutTheseFields') }}
					<span class="ml-4xs">
						<mage-link :to="documentationUrl" size="small" bold @click="onDocumentationUrlClick">
							{{ i18n.baseText('credentialEdit.credentialConfig.openDocs') }}
						</mage-link>
					</span>
				</mage-notice>

				<AuthTypeSelector
					v-if="showAuthTypeSelector && isNewCredential"
					:credential-type="credentialType"
					@auth-type-changed="onAuthTypeChange"
				/>

				<div
					v-if="isAskAssistantAvailable"
					:class="$style.askAssistantButton"
					data-test-id="credential-edit-ask-assistant-button"
				>
					<InlineAskAssistantButton :asked="assistantAlreadyAsked" @click="onAskAssistantClick" />
					<span>for setup instructions</span>
				</div>

				<CopyInput
					v-if="isOAuthType && !allOAuth2BasePropertiesOverridden"
					:label="i18n.baseText('credentialEdit.credentialConfig.oAuthRedirectUrl')"
					:value="oAuthCallbackUrl"
					:copy-button-text="i18n.baseText('credentialEdit.credentialConfig.clickToCopy')"
					:hint="
						i18n.baseText('credentialEdit.credentialConfig.subtitle', {
							interpolate: { appName },
						})
					"
					:toast-title="
						i18n.baseText('credentialEdit.credentialConfig.redirectUrlCopiedToClipboard')
					"
					:redact-value="true"
				/>
			</template>
			<EnterpriseEdition v-else :features="[EnterpriseEditionFeature.Sharing]">
				<div>
					<mage-info-tip :bold="false">
						{{
							i18n.baseText('credentialEdit.credentialEdit.info.sharee', {
								interpolate: { credentialOwnerName },
							})
						}}
					</mage-info-tip>
				</div>
			</EnterpriseEdition>

			<CredentialInputs
				v-if="credentialType && credentialPermissions.update"
				:credential-data="credentialData"
				:credential-properties="credentialProperties"
				:documentation-url="documentationUrl"
				:show-validation-warnings="showValidationWarning"
				@update="onDataChange"
			/>

			<OauthButton
				v-if="
					isOAuthType &&
					requiredPropertiesFilled &&
					!isOAuthConnected &&
					credentialPermissions.update
				"
				:is-google-o-auth-type="isGoogleOAuthType"
				data-test-id="oauth-connect-button"
				@click="$emit('oauth')"
			/>

			<mage-text v-if="isMissingCredentials" color="text-base" size="medium">
				{{ i18n.baseText('credentialEdit.credentialConfig.missingCredentialType') }}
			</mage-text>

			<EnterpriseEdition :features="[EnterpriseEditionFeature.ExternalSecrets]">
				<template #fallback>
					<mage-info-tip class="mt-s">
						{{ i18n.baseText('credentialEdit.credentialConfig.externalSecrets') }}
						<mage-link bold :to="i18n.baseText('settings.externalSecrets.docs')" size="small">
							{{ i18n.baseText('credentialEdit.credentialConfig.externalSecrets.moreInfo') }}
						</mage-link>
					</mage-info-tip>
				</template>
			</EnterpriseEdition>
		</div>
		<CredentialDocs
			v-if="showCredentialDocs"
			:credential-type="credentialType"
			:documentation-url="documentationUrl"
			:docs="docs"
			:class="$style.docs"
		>
		</CredentialDocs>
	</div>
</template>

<style lang="scss" module>
.config {
	--notice-margin: 0;
	flex-grow: 1;

	> * {
		margin-bottom: var(--spacing-l);
	}

	&:has(+ .docs) {
		padding-right: 320px;
	}
}

.docs {
	position: absolute;
	right: 0;
	bottom: 0;
	top: 0;
	max-width: 320px;
}

.googleReconnectLabel {
	margin-right: var(--spacing-3xs);
}

.askAssistantButton {
	display: flex;
	align-items: center;
	> span {
		margin-left: var(--spacing-3xs);
		font-size: var(--font-size-s);
	}
}
</style>
