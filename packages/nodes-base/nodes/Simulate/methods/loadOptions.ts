import type { ILoadOptionsFunctions, INodePropertyOptions } from 'mage-workflow';

export async function getNodeTypes(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const types = this.getKnownNodeTypes() as {
		[key: string]: {
			className: string;
		};
	};

	const returnData: INodePropertyOptions[] = [];

	let typeNames = Object.keys(types);

	if (this.getNode().type === 'mage-nodes-base.simulateTrigger') {
		typeNames = typeNames.filter((type) => type.toLowerCase().includes('trigger'));
	}

	for (const type of typeNames) {
		returnData.push({
			name: types[type].className,
			value: type,
		});
	}

	return returnData;
}
