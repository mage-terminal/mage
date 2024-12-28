import { action } from '@storybook/addon-actions';
import type { StoryFn } from '@storybook/vue3';

import mageUserSelect from './UserSelect.vue';

export default {
	title: 'Modules/UserSelect',
	component: mageUserSelect,
	argTypes: {},
	parameters: {
		backgrounds: { default: '--color-background-light' },
	},
};

const methods = {
	onChange: action('change'),
	onBlur: action('blur'),
	onFocus: action('focus'),
};

const Template: StoryFn = (args, { argTypes }) => ({
	setup: () => ({ args }),
	props: Object.keys(argTypes),
	components: {
		mageUserSelect,
	},
	template:
		'<mage-user-select v-bind="args" v-model="val" @change="onChange" @blur="onBlur" @focus="onFocus" />',
	methods,
	data() {
		return {
			val: '',
		};
	},
});

export const UserSelect = Template.bind({});
UserSelect.args = {
	users: [
		{
			id: '1',
			firstName: 'Sunny',
			lastName: 'Side',
			email: 'sunny@mage.io',
		},
		{
			id: '2',
			firstName: 'Kobi',
			lastName: 'Dog',
			email: 'kobi@mage.io',
		},
		{
			id: '3',
			email: 'invited@mage.io',
		},
	],
	placeholder: 'Select user to transfer to',
	currentUserId: '1',
};
