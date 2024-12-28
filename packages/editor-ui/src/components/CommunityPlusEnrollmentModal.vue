<script lang="ts" setup="">
import { ref } from 'vue';
import { createEventBus } from 'mage-design-system/utils';
import type { Validatable, IValidator } from 'mage-design-system';
import { mageFormInput } from 'mage-design-system';
import { VALID_EMAIL_REGEX } from '@/constants';
import Modal from '@/components/Modal.vue';
import { useI18n } from '@/composables/useI18n';
import { useToast } from '@/composables/useToast';
import { useUsageStore } from '@/stores/usage.store';
import { useTelemetry } from '@/composables/useTelemetry';
import { useUsersStore } from '@/stores/users.store';

const props = defineProps<{
	modalName: string;
	data?: {
		closeCallback?: () => void;
	};
}>();

const i18n = useI18n();
const toast = useToast();
const usageStore = useUsageStore();
const telemetry = useTelemetry();
const usersStore = useUsersStore();

const valid = ref(false);
const email = ref(usersStore.currentUser?.email ?? '');
const validationRules = ref([{ name: 'email' }]);
const validators = ref<{ [key: string]: IValidator }>({
	email: {
		validate: (value: Validatable) => {
			if (typeof value !== 'string') {
				return false;
			}

			if (!VALID_EMAIL_REGEX.test(value)) {
				return {
					message: 'settings.users.invalidEmailError',
					options: { interpolate: { email: value } },
				};
			}

			return false;
		},
	},
});

const modalBus = createEventBus();

const closeModal = () => {
	telemetry.track('User skipped community plus');
	modalBus.emit('close');
	props.data?.closeCallback?.();
};

const confirm = async () => {
	try {
		const { title, text } = await usageStore.registerCommunityEdition(email.value);
		closeModal();
		toast.showMessage({
			title: title ?? i18n.baseText('communityPlusModal.success.title'),
			message:
				text ??
				i18n.baseText('communityPlusModal.success.message', {
					interpolate: { email: email.value },
				}),
			type: 'success',
			duration: 0,
		});
	} catch (error) {
		toast.showError(error, i18n.baseText('communityPlusModal.error.title'));
	}
};
</script>

<template>
	<Modal
		width="500px"
		:name="props.modalName"
		:event-bus="modalBus"
		:show-close="false"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
	>
		<template #content>
			<div>
				<p :class="$style.top">
					<mageBadge>{{ i18n.baseText('communityPlusModal.badge') }}</mageBadge>
				</p>
				<mageText tag="h1" align="center" size="xlarge" class="mb-m">{{
					i18n.baseText('communityPlusModal.title')
				}}</mageText>
				<mageText tag="p">{{ i18n.baseText('communityPlusModal.description') }}</mageText>
				<ul :class="$style.features">
					<li>
						<i>🕰️</i>
						<mageText>
							<strong>{{ i18n.baseText('communityPlusModal.features.first.title') }}</strong>
							{{ i18n.baseText('communityPlusModal.features.first.description') }}
						</mageText>
					</li>
					<li>
						<i>🐞</i>
						<mageText>
							<strong>{{ i18n.baseText('communityPlusModal.features.second.title') }}</strong>
							{{ i18n.baseText('communityPlusModal.features.second.description') }}
						</mageText>
					</li>
					<li>
						<i>🔎</i>
						<mageText>
							<strong>{{ i18n.baseText('communityPlusModal.features.third.title') }}</strong>
							{{ i18n.baseText('communityPlusModal.features.third.description') }}
						</mageText>
					</li>
				</ul>
				<mageFormInput
					id="email"
					v-model="email"
					:label="i18n.baseText('communityPlusModal.input.email.label')"
					type="email"
					name="email"
					label-size="small"
					tag-size="small"
					required
					:show-required-asterisk="true"
					:validate-on-blur="false"
					:validation-rules="validationRules"
					:validators="validators"
					@validate="valid = $event"
				/>
			</div>
		</template>
		<template #footer>
			<div :class="$style.buttons">
				<mageButton :class="$style.skip" type="secondary" text @click="closeModal">{{
					i18n.baseText('communityPlusModal.button.skip')
				}}</mageButton>
				<mageButton :disabled="!valid" type="primary" @click="confirm">
					{{ i18n.baseText('communityPlusModal.button.confirm') }}
				</mageButton>
			</div>
		</template>
	</Modal>
</template>

<style lang="scss" module>
.top {
	display: flex;
	justify-content: center;
	margin: 0 0 var(--spacing-s);
}

.features {
	padding: var(--spacing-s) var(--spacing-l) 0;
	list-style: none;

	li {
		display: flex;
		padding: 0 var(--spacing-s) var(--spacing-m) 0;

		i {
			display: inline-block;
			margin: var(--spacing-5xs) var(--spacing-xs) 0 0;
			font-style: normal;
			font-size: var(--font-size-s);
		}

		strong {
			display: block;
			margin-bottom: var(--spacing-4xs);
		}
	}
}

.buttons {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.skip {
	padding: 0;
}
</style>
