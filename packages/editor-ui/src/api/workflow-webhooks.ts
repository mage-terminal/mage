import type { IUser } from '@/Interface';
import { post } from '@/utils/apiUtils';

const mage_API_BASE_URL = 'https://api.mage.io/api';
const CONTACT_EMAIL_SUBMISSION_ENDPOINT = '/accounts/onboarding';

export async function submitEmailOnSignup(
	instanceId: string,
	currentUser: IUser,
	email: string | undefined,
	agree: boolean,
): Promise<string> {
	return await post(mage_API_BASE_URL, CONTACT_EMAIL_SUBMISSION_ENDPOINT, {
		instance_id: instanceId,
		user_id: `${instanceId}#${currentUser.id}`,
		email,
		agree,
		agree_updates: true,
	});
}
