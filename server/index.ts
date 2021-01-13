import { PluginInitializerContext } from '../../../src/core/server';
import { NoriManagerPlugin } from './plugin';

//  This exports static code and TypeScript types,
//  as well as, Kibana Platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new NoriManagerPlugin(initializerContext);
}

export { NoriManagerPluginSetup, NoriManagerPluginStart } from './types';
