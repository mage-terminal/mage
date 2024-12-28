import '@testing-library/jest-dom';
import { configure } from '@testing-library/vue';
import { config } from '@vue/test-utils';

import { magePlugin } from 'mage-design-system/plugin';

configure({ testIdAttribute: 'data-test-id' });

config.global.plugins = [magePlugin];

window.ResizeObserver =
	window.ResizeObserver ||
	vi.fn().mockImplementation(() => ({
		disconnect: vi.fn(),
		observe: vi.fn(),
		unobserve: vi.fn(),
	}));
