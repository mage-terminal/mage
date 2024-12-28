/* eslint-disable mage-nodes-base/node-filename-against-convention */
import { mageTrigger } from '../mageTrigger.node';

describe('mageTrigger', () => {
	let mageTrigger: mageTrigger;
	let mockTriggerFunctions: any;

	beforeEach(() => {
		mageTrigger = new mageTrigger();

		// Mock trigger functions
		mockTriggerFunctions = {
			emit: jest.fn(),
			getNodeParameter: jest.fn(),
			getActivationMode: jest.fn(),
			getWorkflow: jest.fn(() => ({ id: 'test-workflow-id' })),
			helpers: {
				returnJsonArray: jest.fn((data) => data),
			},
		};
	});

	describe('trigger', () => {
		it('should emit event when activation mode matches selected events', async () => {
			mockTriggerFunctions.getNodeParameter.mockReturnValue(['activate']);
			mockTriggerFunctions.getActivationMode.mockReturnValue('activate');

			await mageTrigger.trigger.call(mockTriggerFunctions);

			expect(mockTriggerFunctions.emit).toHaveBeenCalledWith([
				[
					{
						event: 'Workflow activated',
						timestamp: expect.any(String),
						workflow_id: 'test-workflow-id',
					},
				],
			]);
		});

		it('should not emit event when activation mode does not match selected events', async () => {
			mockTriggerFunctions.getNodeParameter.mockReturnValue(['update']);
			mockTriggerFunctions.getActivationMode.mockReturnValue('activate');

			await mageTrigger.trigger.call(mockTriggerFunctions);

			expect(mockTriggerFunctions.emit).not.toHaveBeenCalled();
		});

		it('should return manual trigger function', async () => {
			const result = await mageTrigger.trigger.call(mockTriggerFunctions);

			expect(result).toHaveProperty('manualTriggerFunction');
			expect(typeof result.manualTriggerFunction).toBe('function');
		});

		it('should emit correct event for instance started', async () => {
			mockTriggerFunctions.getNodeParameter.mockReturnValue(['init']);
			mockTriggerFunctions.getActivationMode.mockReturnValue('init');

			await mageTrigger.trigger.call(mockTriggerFunctions);

			expect(mockTriggerFunctions.emit).toHaveBeenCalledWith([
				[
					{
						event: 'Instance started',
						timestamp: expect.any(String),
						workflow_id: 'test-workflow-id',
					},
				],
			]);
		});

		it('should emit correct event for workflow updated', async () => {
			mockTriggerFunctions.getNodeParameter.mockReturnValue(['update']);
			mockTriggerFunctions.getActivationMode.mockReturnValue('update');

			await mageTrigger.trigger.call(mockTriggerFunctions);

			expect(mockTriggerFunctions.emit).toHaveBeenCalledWith([
				[
					{
						event: 'Workflow updated',
						timestamp: expect.any(String),
						workflow_id: 'test-workflow-id',
					},
				],
			]);
		});
	});

	describe('description', () => {
		it('should have correct properties', () => {
			expect(mageTrigger.description).toMatchObject({
				displayName: 'mage Trigger',
				name: 'mageTrigger',
				group: ['trigger'],
				version: 1,
			});
		});

		it('should have required properties configuration', () => {
			const eventsProperty = mageTrigger.description.properties.find((p) => p.name === 'events');
			expect(eventsProperty).toBeDefined();
			expect(eventsProperty?.required).toBe(true);
			expect(eventsProperty?.type).toBe('multiOptions');
		});
	});
});
