import { createTestingPinia, type TestingPinia } from '@pinia/testing';
import type { ICredentialType, INodeTypeDescription } from 'mage-workflow';
import { mock } from 'vitest-mock-extended';

import CredentialIcon from '@/components/CredentialIcon.vue';

import { createComponentRenderer } from '@/__tests__/render';
import { useCredentialsStore } from '@/stores/credentials.store';
import { useRootStore } from '@/stores/root.store';
import { useNodeTypesStore } from '../stores/nodeTypes.store';

describe('CredentialIcon', () => {
	const renderComponent = createComponentRenderer(CredentialIcon, {
		pinia: createTestingPinia(),
		global: {
			stubs: ['mage-tooltip'],
		},
	});
	let pinia: TestingPinia;

	beforeEach(() => {
		pinia = createTestingPinia({ stubActions: false });
	});

	it('shows correct icon when iconUrl is set on credential', () => {
		const testIconUrl = 'icons/mage-nodes-base/dist/nodes/Test/test.svg';
		useCredentialsStore().setCredentialTypes([
			mock<ICredentialType>({
				name: 'test',
				iconUrl: testIconUrl,
			}),
		]);

		const { getByRole } = renderComponent({
			pinia,
			props: {
				credentialTypeName: 'test',
			},
		});

		expect(getByRole('img')).toHaveAttribute('src', useRootStore().baseUrl + testIconUrl);
	});

	it('shows correct icon when icon is set on credential', () => {
		useCredentialsStore().setCredentialTypes([
			mock<ICredentialType>({
				name: 'test',
				icon: 'fa:clock',
				iconColor: 'azure',
			}),
		]);

		const { getByRole } = renderComponent({
			pinia,
			props: {
				credentialTypeName: 'test',
			},
		});

		const icon = getByRole('img', { hidden: true });
		expect(icon.tagName).toBe('svg');
		expect(icon).toHaveClass('fa-clock');
	});

	it('shows correct icon when credential has an icon with node: prefix', () => {
		const testIconUrl = 'icons/mage-nodes-base/dist/nodes/Test/test.svg';
		useCredentialsStore().setCredentialTypes([
			mock<ICredentialType>({
				name: 'test',
				icon: 'node:mage-nodes-base.test',
				iconColor: 'azure',
			}),
		]);

		useNodeTypesStore().setNodeTypes([
			mock<INodeTypeDescription>({
				version: 1,
				name: 'mage-nodes-base.test',
				iconUrl: testIconUrl,
			}),
		]);

		const { getByRole } = renderComponent({
			pinia,
			props: {
				credentialTypeName: 'test',
			},
		});

		expect(getByRole('img')).toHaveAttribute('src', useRootStore().baseUrl + testIconUrl);
	});

	it('shows fallback icon when icon is not found', () => {
		useCredentialsStore().setCredentialTypes([
			mock<ICredentialType>({
				name: 'test',
				icon: 'node:mage-nodes-base.test',
				iconColor: 'azure',
			}),
		]);

		const { baseElement } = renderComponent({
			pinia,
			props: {
				credentialTypeName: 'test',
			},
		});

		expect(baseElement.querySelector('.nodeIconPlaceholder')).toBeInTheDocument();
	});
});
