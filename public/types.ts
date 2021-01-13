import { NavigationPublicPluginStart } from '../../../src/plugins/navigation/public';

export interface NoriManagerPluginSetup {
  getGreeting: () => string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NoriManagerPluginStart {}

export interface AppPluginStartDependencies {
  navigation: NavigationPublicPluginStart;
}
