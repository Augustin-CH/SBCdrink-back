'use strict';

/**
 * recipe additionnal router
 */

module.exports = {
    routes: [
      { // Path defined with an URL parameter
        method: 'GET',
        path: '/recipes/available', 
        handler: 'recipe.available',
      }
    ]
  }