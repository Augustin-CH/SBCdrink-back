'use strict';

/**
 * cocktail additionnal router
 */

module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/cocktail/make', 
        handler: 'cocktail.make',
      }
    ]
  }