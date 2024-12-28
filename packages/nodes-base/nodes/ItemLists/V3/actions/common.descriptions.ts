import type { INodeProperties } from 'mage-workflow';

export const disableDotNotationBoolean: INodeProperties = {
	displayName: 'Disable Dot Notation',
	name: 'disableDotNotation',
	type: 'boolean',
	default: false,
	description:
		'Whether to disallow referencing child fields using `parent.child` in the field name',
};
