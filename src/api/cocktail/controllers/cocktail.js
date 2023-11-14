'use strict';

var machine = require('../../../../protos/machine');

/**
 * cocktail controller
 */
module.exports = {
    async make(ctx, next) {
      const data = ctx.request.body;

      const configurations = await strapi.db.query('api::machine-configuration.machine-configuration').findMany({
        populate: {
          ingredient: true
        },
        orderBy: {
          slot: 'ASC'
        }
      });

      const dataWithSlot = []
      for (const step of data) {
        const slot = configurations.find((configuration) => configuration.ingredient.id == step.ingredient)?.slot;
        if(!slot) return ctx.badRequest('Invalid ingredient', `Ingredient ${step.ingredientId} not found in machine configuration slot.`)
        dataWithSlot.push({
          ...step,
          slot
        })
      }

      const res = await machine.runMakeCocktail(dataWithSlot)
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