'use strict';

/**
 * machine-configuration additionnal router
 */

module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/machine-configurations', 
        handler: 'machine-configuration.find',
      },
      {
        method: 'PUT',
        path: '/machine-configurations/:slot', 
        handler: 'machine-configuration.update',
      }
    ]
  }