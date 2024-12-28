import type { Plugin } from 'vue';
import { magePlusEndpointHandler } from '@/plugins/jsplumb/magePlusEndpointType';
import * as magePlusEndpointRenderer from '@/plugins/jsplumb/magePlusEndpointRenderer';
import { mageConnector } from '@/plugins/connectors/mageCustomConnector';
import * as mageAddInputEndpointRenderer from '@/plugins/jsplumb/mageAddInputEndpointRenderer';
import { mageAddInputEndpointHandler } from '@/plugins/jsplumb/mageAddInputEndpointType';
import type { AbstractConnector } from '@jsplumb/core';
import { Connectors, EndpointFactory } from '@jsplumb/core';
import type { Constructable } from '@jsplumb/util';

export const JsPlumbPlugin: Plugin = {
	install: () => {
		Connectors.register(mageConnector.type, mageConnector as Constructable<AbstractConnector>);

		magePlusEndpointRenderer.register();
		EndpointFactory.registerHandler(magePlusEndpointHandler);

		mageAddInputEndpointRenderer.register();
		EndpointFactory.registerHandler(mageAddInputEndpointHandler);
	},
};
