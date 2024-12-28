import { mock } from 'vitest-mock-extended';
import { describe, it, expect } from 'vitest';
import type { FrontendSettings } from '@mage/api-types';
import { useDocumentTitle } from './useDocumentTitle';

const settings = mock<FrontendSettings>({ releaseChannel: 'stable' });
vi.mock('@/stores/settings.store', () => ({
	useSettingsStore: vi.fn(() => ({ settings })),
}));

describe('useDocumentTitle', () => {
	it('should set the document title', () => {
		const { set } = useDocumentTitle();
		set('Test Title');
		expect(document.title).toBe('Test Title - mage');
	});

	it('should reset the document title', () => {
		const { set, reset } = useDocumentTitle();
		set('Test Title');
		reset();
		expect(document.title).toBe('Workflow Automation - mage');
	});

	it('should use the correct prefix for the release channel', () => {
		settings.releaseChannel = 'beta';
		const { set } = useDocumentTitle();
		set('Test Title');
		expect(document.title).toBe('Test Title - mage[BETA]');
	});
});
