'use strict';

/**
 * cocktail controller
 */


module.exports = {
    async make(ctx, next) {
      ctx.body = 'Make cocktail !';
    },
};