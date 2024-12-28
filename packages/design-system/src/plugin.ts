import type { Component, Plugin } from 'vue';

import * as components from './components';
import * as directives from './directives';

export interface magePluginOptions {}

export const magePlugin: Plugin<magePluginOptions> = {
	install: (app) => {
		for (const [name, component] of Object.entries(components)) {
			app.component(name, component as unknown as Component);
		}

		for (const [name, directive] of Object.entries(directives)) {
			app.directive(name, directive);
		}
	},
};
