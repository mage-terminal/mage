import type { INodeProperties } from 'mage-workflow';
import { cronNodeOptions } from 'mage-workflow';

const { NODE_ENV } = process.env;
export const inProduction = NODE_ENV === 'production';
export const inDevelopment = !NODE_ENV || NODE_ENV === 'development';

export const CUSTOM_EXTENSION_ENV = 'mage_CUSTOM_EXTENSIONS';
export const PLACEHOLDER_EMPTY_EXECUTION_ID = '__UNKNOWN__';
export const PLACEHOLDER_EMPTY_WORKFLOW_ID = '__EMPTY__';
export const HTTP_REQUEST_NODE_TYPE = 'mage-nodes-base.httpRequest';
export const HTTP_REQUEST_TOOL_NODE_TYPE = '@mage/mage-nodes-langchain.toolHttpRequest';

export const CUSTOM_NODES_CATEGORY = 'Custom Nodes';

export const RESTRICT_FILE_ACCESS_TO = 'mage_RESTRICT_FILE_ACCESS_TO';
export const BLOCK_FILE_ACCESS_TO_mage_FILES = 'mage_BLOCK_FILE_ACCESS_TO_mage_FILES';
export const CONFIG_FILES = 'mage_CONFIG_FILES';
export const BINARY_DATA_STORAGE_PATH = 'mage_BINARY_DATA_STORAGE_PATH';
export const UM_EMAIL_TEMPLATES_INVITE = 'mage_UM_EMAIL_TEMPLATES_INVITE';
export const UM_EMAIL_TEMPLATES_PWRESET = 'mage_UM_EMAIL_TEMPLATES_PWRESET';

export const commonPollingParameters: INodeProperties[] = [
	{
		displayName: 'Poll Times',
		name: 'pollTimes',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
			multipleValueButtonText: 'Add Poll Time',
		},
		default: { item: [{ mode: 'everyMinute' }] },
		description: 'Time at which polling should occur',
		placeholder: 'Add Poll Time',
		options: cronNodeOptions,
	},
];

export const commonCORSParameters: INodeProperties[] = [
	{
		displayName: 'Allowed Origins (CORS)',
		name: 'allowedOrigins',
		type: 'string',
		default: '*',
		description:
			'Comma-separated list of URLs allowed for cross-origin non-preflight requests. Use * (default) to allow all origins.',
	},
];
