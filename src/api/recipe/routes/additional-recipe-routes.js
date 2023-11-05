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
      },
      {
        method: 'GET',
        path: '/recipes/find', 
        handler: 'recipe.find',
      },
      {
        method: 'PUT',
        path: '/recipes/:id', 
        handler: 'recipe.update',
      },
    ]
  }