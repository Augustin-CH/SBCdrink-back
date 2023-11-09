'use strict';

var machine = require('../../../../protos/machine');

/**
 * cocktail controller
 */
module.exports = {
    async make(ctx, next) {

      const data = ctx.request.body;
      const res = await machine.runMakeCocktail(data)
        .then((res) => {
          return res;
        })
        .catch((err) => {
          console.log(err);
          return "MACHINE CONNECTION ERROR"
        });
      try {
        ctx.body = res;
      } catch (err) {
        ctx.body = err;
      }
    },
};