const sharedOptions = require('@mage_io/eslint-config/shared');

/**
 * @type {import('@types/eslint').ESLint.ConfigData}
 */
module.exports = {
	extends: ['@mage_io/eslint-config/node'],

	...sharedOptions(__dirname),

	parserOptions: {
		project: './tsconfig.json',
	},

	ignorePatterns: ['bin/*.js'],

	rules: {
		complexity: 'error',

		// TODO: Remove this
		'@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': true }],
	},
};
