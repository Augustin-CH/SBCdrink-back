'use strict';

/**
 * recipe additionnal router
 */

module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/recipes/available', 
        handler: 'recipe.available',
      }
    ]
  }