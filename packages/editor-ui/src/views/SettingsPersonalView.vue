<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from '@/composables/useI18n';
import { useToast } from '@/composables/useToast';
import { useDocumentTitle } from '@/composables/useDocumentTitle';
import type { IFormInputs, IUser, ThemeOption } from '@/Interface';
import {
	CHANGE_PASSWORD_MODAL_KEY,
	MFA_DOCS_URL,
	MFA_SETUP_MODAL_KEY,
	PROMPT_MFA_CODE_MODAL_KEY,
} from '@/constants';
import { useUIStore } from '@/stores/ui.store';
import { useUsersStore } from '@/stores/users.store';
import { useSettingsStore } from '@/stores/settings.store';
import { createFormEventBus } from 'mage-design-system/utils';
import type { MfaModalEvents } from '@/event-bus/mfa';
import { promptMfaCodeBus } from '@/event-bus/mfa';

type UserBasicDetailsForm = {
	firstName: string;
	lastName: string;
	email: string;
};

type UserBasicDetailsWithMfa = UserBasicDetailsForm & {
	mfaCode?: string;
};

const i18n = useI18n();
const { showToast, showError } = useToast();
const documentTitle = useDocumentTitle();

const hasAnyBasicInfoChanges = ref<boolean>(false);
const formInputs = ref<null | IFormInputs>(null);
const formBus = createFormEventBus();
const readyToSubmit = ref(false);
const currentSelectedTheme = ref(useUIStore().theme);
const themeOptions = ref<Array<{ name: ThemeOption; label: string }>>([
	{
		name: 'system',
		label: 'settings.personal.theme.systemDefault',
	},
	{
		name: 'light',
		label: 'settings.personal.theme.light',
	},
	{
		name: 'dark',
		label: 'settings.personal.theme.dark',
	},
]);

const uiStore = useUIStore();
const usersStore = useUsersStore();
const settingsStore = useSettingsStore();

const currentUser = computed((): IUser | null => {
	return usersStore.currentUser;
});
const isExternalAuthEnabled = computed((): boolean => {
	const isLdapEnabled =
		settingsStore.settings.enterprise.ldap && currentUser.value?.signInType === 'ldap';
	const isSamlEnabled =
		settingsStore.isSamlLoginEnabled && settingsStore.isDefaultAuthenticationSaml;
	return isLdapEnabled || isSamlEnabled;
});
const isPersonalSecurityEnabled = computed((): boolean => {
	return usersStore.isInstanceOwner || !isExternalAuthEnabled.value;
});
const mfaDisabled = computed((): boolean => {
	return !usersStore.mfaEnabled;
});
const isMfaFeatureEnabled = computed((): boolean => {
	return settingsStore.isMfaFeatureEnabled;
});
const hasAnyPersonalisationChanges = computed((): boolean => {
	return currentSelectedTheme.value !== uiStore.theme;
});
const hasAnyChanges = computed(() => {
	return hasAnyBasicInfoChanges.value || hasAnyPersonalisationChanges.value;
});

onMounted(() => {
	documentTitle.set(i18n.baseText('settings.personal.personalSettings'));
	formInputs.value = [
		{
			name: 'firstName',
			initialValue: currentUser.value?.firstName,
			properties: {
				label: i18n.baseText('auth.firstName'),
				maxlength: 32,
				required: true,
				autocomplete: 'given-name',
				capitalize: true,
				disabled: isExternalAuthEnabled.value,
			},
		},
		{
			name: 'lastName',
			initialValue: currentUser.value?.lastName,
			properties: {
				label: i18n.baseText('auth.lastName'),
				maxlength: 32,
				required: true,
				autocomplete: 'family-name',
				capitalize: true,
				disabled: isExternalAuthEnabled.value,
			},
		},
		{
			name: 'email',
			initialValue: currentUser.value?.email,
			properties: {
				label: i18n.baseText('auth.email'),
				type: 'email',
				required: true,
				validationRules: [{ name: 'VALID_EMAIL' }],
				autocomplete: 'email',
				capitalize: true,
				disabled: !isPersonalSecurityEnabled.value,
			},
		},
	];
});

function onInput() {
	hasAnyBasicInfoChanges.value = true;
}

function onReadyToSubmit(ready: boolean) {
	readyToSubmit.value = ready;
}

/** Saves users basic info and personalization settings */
async function saveUserSettings(params: UserBasicDetailsWithMfa) {
	try {
		// The MFA code might be invalid so we update the user's basic info first
		await updateUserBasicInfo(params);
		await updatePersonalisationSettings();

		showToast({
			title: i18n.baseText('settings.personal.personalSettingsUpdated'),
			message: '',
			type: 'success',
		});
	} catch (e) {
		showError(e, i18n.baseText('settings.personal.personalSettingsUpdatedError'));
	}
}

async function onSubmit(form: UserBasicDetailsForm) {
	if (!usersStore.currentUser?.mfaEnabled) {
		await saveUserSettings(form);
		return;
	}

	uiStore.openModal(PROMPT_MFA_CODE_MODAL_KEY);

	promptMfaCodeBus.once('closed', async (payload: MfaModalEvents['closed']) => {
		if (!payload) {
			// User closed the modal without submitting the form
			return;
		}

		await saveUserSettings({
			...form,
			mfaCode: payload.mfaCode,
		});
	});
}

async function updateUserBasicInfo(userBasicInfo: UserBasicDetailsWithMfa) {
	if (!hasAnyBasicInfoChanges.value || !usersStore.currentUserId) {
		return;
	}

	await usersStore.updateUser({
		firstName: userBasicInfo.firstName,
		lastName: userBasicInfo.lastName,
		email: userBasicInfo.email,
		mfaCode: userBasicInfo.mfaCode,
	});
	hasAnyBasicInfoChanges.value = false;
}

async function updatePersonalisationSettings() {
	if (!hasAnyPersonalisationChanges.value) {
		return;
	}

	uiStore.setTheme(currentSelectedTheme.value);
}

function onSaveClick() {
	formBus.emit('submit');
}

function openPasswordModal() {
	uiStore.openModal(CHANGE_PASSWORD_MODAL_KEY);
}

async function onMfaEnableClick() {
	if (!settingsStore.isCloudDeployment || !usersStore.isInstanceOwner) {
		uiStore.openModal(MFA_SETUP_MODAL_KEY);
		return;
	}

	try {
		await usersStore.canEnableMFA();
		uiStore.openModal(MFA_SETUP_MODAL_KEY);
	} catch (e) {
		showToast({
			title: i18n.baseText('settings.personal.mfa.toast.canEnableMfa.title'),
			message: e.message,
			type: 'error',
		});
		await usersStore.sendConfirmationEmail();
	}
}

async function disableMfa(payload: MfaModalEvents['closed']) {
	if (!payload) {
		// User closed the modal without submitting the form
		return;
	}

	try {
		await usersStore.disableMfa(payload);

		showToast({
			title: i18n.baseText('settings.personal.mfa.toast.disabledMfa.title'),
			message: i18n.baseText('settings.personal.mfa.toast.disabledMfa.message'),
			type: 'success',
			duration: 0,
		});
	} catch (e) {
		showError(e, i18n.baseText('settings.personal.mfa.toast.disabledMfa.error.message'));
	}
}

async function onMfaDisableClick() {
	uiStore.openModal(PROMPT_MFA_CODE_MODAL_KEY);

	promptMfaCodeBus.once('closed', disableMfa);
}

onBeforeUnmount(() => {
	promptMfaCodeBus.off('closed', disableMfa);
});
</script>

<template>
	<div :class="$style.container" data-test-id="personal-settings-container">
		<div :class="$style.header">
			<mage-heading size="2xlarge">{{
				i18n.baseText('settings.personal.personalSettings')
			}}</mage-heading>
			<div v-if="currentUser" :class="$style.user">
				<span :class="$style.username" data-test-id="current-user-name">
					<mage-text color="text-light">{{ currentUser.fullName }}</mage-text>
				</span>
				<mage-avatar
					:first-name="currentUser.firstName"
					:last-name="currentUser.lastName"
					size="large"
				/>
			</div>
		</div>
		<div>
			<div class="mb-s">
				<mage-heading size="large">{{
					i18n.baseText('settings.personal.basicInformation')
				}}</mage-heading>
			</div>
			<div data-test-id="personal-data-form">
				<mage-form-inputs
					v-if="formInputs"
					:inputs="formInputs"
					:event-bus="formBus"
					@update="onInput"
					@ready="onReadyToSubmit"
					@submit="onSubmit"
				/>
			</div>
		</div>
		<div v-if="isPersonalSecurityEnabled">
			<div class="mb-s">
				<mage-heading size="large">{{ i18n.baseText('settings.personal.security') }}</mage-heading>
			</div>
			<div class="mb-s">
				<mage-input-label :label="i18n.baseText('auth.password')">
					<mage-link data-test-id="change-password-link" @click="openPasswordModal">{{
						i18n.baseText('auth.changePassword')
					}}</mage-link>
				</mage-input-label>
			</div>
			<div v-if="isMfaFeatureEnabled" data-test-id="mfa-section">
				<div class="mb-xs">
					<mage-input-label :label="i18n.baseText('settings.personal.mfa.section.title')" />
					<mage-text :bold="false" :class="$style.infoText">
						{{
							mfaDisabled
								? i18n.baseText('settings.personal.mfa.button.disabled.infobox')
								: i18n.baseText('settings.personal.mfa.button.enabled.infobox')
						}}
						<mage-link :to="MFA_DOCS_URL" size="small" :bold="true">
							{{ i18n.baseText('generic.learnMore') }}
						</mage-link>
					</mage-text>
				</div>
				<mage-button
					v-if="mfaDisabled"
					:class="$style.button"
					type="tertiary"
					:label="i18n.baseText('settings.personal.mfa.button.enabled')"
					data-test-id="enable-mfa-button"
					@click="onMfaEnableClick"
				/>
				<mage-button
					v-else
					:class="$style.disableMfaButton"
					type="tertiary"
					:label="i18n.baseText('settings.personal.mfa.button.disabled')"
					data-test-id="disable-mfa-button"
					@click="onMfaDisableClick"
				/>
			</div>
		</div>
		<div>
			<div class="mb-s">
				<mage-heading size="large">{{
					i18n.baseText('settings.personal.personalisation')
				}}</mage-heading>
			</div>
			<div>
				<mage-input-label :label="i18n.baseText('settings.personal.theme')">
					<mage-select
						v-model="currentSelectedTheme"
						:class="$style.themeSelect"
						data-test-id="theme-select"
						size="small"
						filterable
					>
						<mage-option
							v-for="item in themeOptions"
							:key="item.name"
							:label="$t(item.label)"
							:value="item.name"
						>
						</mage-option>
					</mage-select>
				</mage-input-label>
			</div>
		</div>
		<div>
			<mage-button
				float="right"
				:label="i18n.baseText('settings.personal.save')"
				size="large"
				:disabled="!hasAnyChanges || !readyToSubmit"
				data-test-id="save-settings-button"
				@click="onSaveClick"
			/>
		</div>
	</div>
</template>

<style lang="scss" module>
.container {
	> * {
		margin-bottom: var(--spacing-2xl);
	}
	padding-bottom: 100px;
}

.header {
	display: flex;
	align-items: center;
	white-space: nowrap;
	*:first-child {
		flex-grow: 1;
	}
}

.user {
	display: flex;
	align-items: center;

	@media (max-width: $breakpoint-2xs) {
		display: none;
	}
}

.username {
	margin-right: var(--spacing-s);
	text-align: right;

	@media (max-width: $breakpoint-sm) {
		max-width: 100px;
		overflow: hidden;
		text-overflow: ellipsis;
	}
}

.disableMfaButton {
	--button-color: var(--color-danger);
	> span {
		font-weight: var(--font-weight-bold);
	}
}

.button {
	font-size: var(--spacing-xs);
	> span {
		font-weight: var(--font-weight-bold);
	}
}

.infoText {
	font-size: var(--font-size-2xs);
	color: var(--color-text-light);
}

.themeSelect {
	max-width: 50%;
}
</style>
