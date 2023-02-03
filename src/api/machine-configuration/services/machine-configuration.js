'use strict';

/**
 * machine-configuration service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::machine-configuration.machine-configuration');
