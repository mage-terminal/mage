import { render } from '@testing-library/vue';

import { mageAvatar, mageUserInfo } from 'mage-design-system/main';

import UserStack from './UserStack.vue';

describe('UserStack', () => {
	it('should render flat user list', () => {
		const { container } = render(UserStack, {
			props: {
				currentUserEmail: 'hello@mage.io',
				users: {
					Owners: [
						{
							id: '1',
							firstName: 'Sunny',
							lastName: 'Side',
							fullName: 'Sunny Side',
							email: 'hello@mage.io',
							isPendingUser: false,
							isOwner: true,
							signInType: 'email',
							disabled: false,
						},
						{
							id: '2',
							firstName: 'Kobi',
							lastName: 'Dog',
							fullName: 'Kobi Dog',
							email: 'kobi@mage.io',
							isPendingUser: false,
							isOwner: false,
							signInType: 'ldap',
							disabled: true,
						},
					],
				},
			},
			global: {
				components: {
					'mage-avatar': mageAvatar,
					'mage-user-info': mageUserInfo,
				},
			},
		});
		expect(container.querySelector('.user-stack')).toBeInTheDocument();
		expect(container.querySelectorAll('svg')).toHaveLength(2);
	});

	it('should not show all avatars', async () => {
		const { container } = render(UserStack, {
			props: {
				currentUserEmail: 'hello@mage.io',
				users: {
					Owners: [
						{
							id: '1',
							firstName: 'Sunny',
							lastName: 'Side',
							fullName: 'Sunny Side',
							email: 'hello@mage.io',
							isPendingUser: false,
							isOwner: true,
							signInType: 'email',
							disabled: false,
						},
						{
							id: '2',
							firstName: 'Kobi',
							lastName: 'Dog',
							fullName: 'Kobi Dog',
							email: 'kobi@mage.io',
							isPendingUser: false,
							isOwner: false,
							signInType: 'ldap',
							disabled: true,
						},
						{
							id: '3',
							firstName: 'John',
							lastName: 'Doe',
							fullName: 'John Doe',
							email: 'john@mage.io',
							isPendingUser: false,
							isOwner: false,
							signInType: 'email',
							disabled: false,
						},
						{
							id: '4',
							firstName: 'Jane',
							lastName: 'Doe',
							fullName: 'Jane Doe',
							email: 'jane@mage.io',
							isPendingUser: false,
							isOwner: false,
							signInType: 'ldap',
							disabled: true,
						},
					],
				},
			},
			global: {
				components: {
					'mage-avatar': mageAvatar,
					'mage-user-info': mageUserInfo,
				},
			},
		});
		expect(container.querySelector('.user-stack')).toBeInTheDocument();
		expect(container.querySelectorAll('svg')).toHaveLength(2);
		expect(container.querySelector('.hiddenBadge')).toHaveTextContent('+2');
	});
});
