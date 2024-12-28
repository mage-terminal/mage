import type { IRestApiContext, ImagePrompts, ImagePromptResponse } from '../Interface';
import { makeRestApiRequest, get, post } from '@/utils/apiUtils';
import { mage_IO_BASE_URL, NPM_COMMUNITY_NODE_SEARCH_API_URL } from '@/constants';
import type { FrontendSettings } from '@mage/api-types';

export async function getSettings(context: IRestApiContext): Promise<FrontendSettings> {
	return await makeRestApiRequest(context, 'GET', '/settings');
}

export async function getPromptsData(instanceId: string, userId: string): Promise<ImagePrompts> {
	return await get(
		mage_IO_BASE_URL,
		'/prompts',
		{},
		{ 'mage-instance-id': instanceId, 'mage-user-id': userId },
	);
}

export async function submitContactInfo(
	instanceId: string,
	userId: string,
	email: string,
): Promise<ImagePromptResponse> {
	return await post(
		mage_IO_BASE_URL,
		'/prompt',
		{ email },
		{ 'mage-instance-id': instanceId, 'mage-user-id': userId },
	);
}

export async function getAvailableCommunityPackageCount(): Promise<number> {
	const response = await get(
		NPM_COMMUNITY_NODE_SEARCH_API_URL,
		'search?q=keywords:mage-community-node-package',
	);

	return response.total || 0;
}
