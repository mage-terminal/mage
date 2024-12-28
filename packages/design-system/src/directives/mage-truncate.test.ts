import { render } from '@testing-library/vue';

import { mageTruncate } from './mage-truncate';

describe('Directive mage-truncate', () => {
	it('should truncate text to 30 chars by default', async () => {
		const { html } = render(
			{
				props: {
					text: {
						type: String,
					},
				},
				template: '<div v-mage-truncate>{{text}}</div>',
			},
			{
				props: {
					text: 'This is a very long text that should be truncated',
				},
				global: {
					directives: {
						mageTruncate,
					},
				},
			},
		);
		expect(html()).toBe('<div>This is a very long text that ...</div>');
	});

	it('should truncate text to 30 chars in case of wrong argument', async () => {
		const { html } = render(
			{
				props: {
					text: {
						type: String,
					},
				},
				template: '<div v-mage-truncate:ab>{{text}}</div>',
			},
			{
				props: {
					text: 'This is a very long text that should be truncated',
				},
				global: {
					directives: {
						mageTruncate,
					},
				},
			},
		);
		expect(html()).toBe('<div>This is a very long text that ...</div>');
	});

	it('should truncate text to given length', async () => {
		const { html } = render(
			{
				props: {
					text: {
						type: String,
					},
				},
				template: '<div v-mage-truncate:25>{{text}}</div>',
			},
			{
				props: {
					text: 'This is a very long text that should be truncated',
				},
				global: {
					directives: {
						mageTruncate,
					},
				},
			},
		);
		expect(html()).toBe('<div>This is a very long text ...</div>');
	});
});
