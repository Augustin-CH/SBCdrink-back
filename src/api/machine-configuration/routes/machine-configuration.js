'use strict';

/**
 * machine-configuration router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::machine-configuration.machine-configuration', {
  only: [''],
});
  