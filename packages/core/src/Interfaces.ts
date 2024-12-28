import type {
	ITriggerResponse,
	IWorkflowSettings as IWorkflowSettingsWorkflow,
	ValidationResult,
} from 'mage-workflow';

export type Class<T = object, A extends unknown[] = unknown[]> = new (...args: A) => T;

export interface IResponseError extends Error {
	statusCode?: number;
}

export interface IWorkflowSettings extends IWorkflowSettingsWorkflow {
	errorWorkflow?: string;
	timezone?: string;
	saveManualRuns?: boolean;
}

export interface IWorkflowData {
	triggerResponses?: ITriggerResponse[];
}

export namespace mage {
	export interface PackageJson {
		name: string;
		version: string;
		mage?: {
			credentials?: string[];
			nodes?: string[];
		};
		author?: {
			name?: string;
			email?: string;
		};
	}
}

export type ExtendedValidationResult = ValidationResult & { fieldName?: string };
