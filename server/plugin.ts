import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '../../../src/core/server';

import { NoriManagerPluginSetup, NoriManagerPluginStart } from './types';
import { defineRoutes } from './routes';

export class NoriManagerPlugin implements Plugin<NoriManagerPluginSetup, NoriManagerPluginStart> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public setup(core: CoreSetup) {
    this.logger.debug('Nori Manager: Setup');
    const router = core.http.createRouter();

    // Register server side APIs
    defineRoutes(router);

    return {};
  }

  public start(core: CoreStart) {
    this.logger.debug('Nori Manager: Started');
    return {};
  }

  public stop() {}
}
