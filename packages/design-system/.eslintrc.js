const sharedOptions = require('@mage_io/eslint-config/shared');

/**
 * @type {import('@types/eslint').ESLint.ConfigData}
 */
module.exports = {
	extends: ['@mage_io/eslint-config/frontend'],

	...sharedOptions(__dirname, 'frontend'),

	rules: {
		// TODO: Remove these
		'import/no-default-export': 'warn',
		'@typescript-eslint/no-unsafe-argument': 'warn',
		'@typescript-eslint/no-unsafe-return': 'warn',
		'@typescript-eslint/no-unsafe-member-access': 'warn',
		'@typescript-eslint/prefer-optional-chain': 'warn',
		'@typescript-eslint/prefer-nullish-coalescing': 'warn',
	},

	overrides: [
		{
			files: ['src/**/*.stories.ts', 'src/**/*.vue', 'src/**/*.spec.ts'],
			rules: {
				'@typescript-eslint/naming-convention': [
					'warn',
					{
						selector: ['variable', 'property'],
						format: ['PascalCase', 'camelCase', 'UPPER_CASE'],
					},
				],
			},
		},
		{
			files: ['src/components/mageFormInput/validators.ts'],
			rules: {
				'@typescript-eslint/naming-convention': [
					'error',
					{
						selector: ['property'],
						format: ['camelCase', 'UPPER_CASE'],
					},
				],
			},
		},
	],
};
