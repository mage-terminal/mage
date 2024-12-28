import type { IExecuteFunctions, ILoadOptionsFunctions, IDataObject } from 'mage-workflow';

import type { IForm } from './FormInterface';
import { cockpitApiRequest } from './GenericFunctions';

export async function submitForm(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	resourceName: string,
	form: IDataObject,
) {
	const body: IForm = {
		form,
	};

	return await cockpitApiRequest.call(this, 'POST', `/forms/submit/${resourceName}`, body);
}
