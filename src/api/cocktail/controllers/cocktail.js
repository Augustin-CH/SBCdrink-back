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

      const dataWithSlot = [];
      let lastOrder = 1;

      const sortRecipeIngredients = data.sort((a, b) => a.order - b.order);
      
      for (const recipeIngredient of sortRecipeIngredients) {
        const slot = configurations.find((configuration) => configuration.ingredient.id == recipeIngredient.ingredient);
        if(!slot) return ctx.badRequest('Invalid ingredient', `Ingredient ${recipeIngredient.ingredientId} not found in machine configuration slot.`)
        let remainingQuantity = recipeIngredient.quantity * 10;
        let ingredientStep = 0;

        while(remainingQuantity > 0) {
          const stepQuantity = (remainingQuantity > slot.measureVolume) ? slot.measureVolume : remainingQuantity;
          const delayAfterPress = (stepQuantity === remainingQuantity) ? 0 : slot.measureVolume * 0.18;

          dataWithSlot.push({
            order: lastOrder + ingredientStep,
            ingredient: recipeIngredient.ingredient,
            slot: slot.slot,
            pressedTime: 0.18 * stepQuantity,
            delayAfterPress: delayAfterPress,
          });

          remainingQuantity -= stepQuantity;
          ingredientStep++;
        }
        lastOrder = lastOrder + ingredientStep;
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