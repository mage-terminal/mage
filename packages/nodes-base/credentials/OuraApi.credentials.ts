import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'mage-workflow';

export class OuraApi implements ICredentialType {
	name = 'ouraApi';

	displayName = 'Oura API';

	documentationUrl = 'oura';

	properties: INodeProperties[] = [
		{
			displayName: 'Personal Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.accessToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.ouraring.com',
			url: '/v2/usercollection/personal_info',
		},
	};
}
