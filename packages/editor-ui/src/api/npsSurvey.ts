import type { IRestApiContext } from '@/Interface';
import { makeRestApiRequest } from '@/utils/apiUtils';
import type { NpsSurveyState } from 'mage-workflow';

export async function updateNpsSurveyState(context: IRestApiContext, state: NpsSurveyState) {
	await makeRestApiRequest(context, 'PATCH', '/user-settings/nps-survey', state);
}
