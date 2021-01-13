import './index.scss';

import { NoriManagerPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, Kibana Platform `plugin()` initializer.
export function plugin() {
  return new NoriManagerPlugin();
}
export { NoriManagerPluginSetup, NoriManagerPluginStart } from './types';
