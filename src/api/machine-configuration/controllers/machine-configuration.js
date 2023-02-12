'use strict';

/**
 * machine-configuration controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::machine-configuration.machine-configuration', ({ strapi }) => ({
async find(ctx) {
    const configurations = await strapi.db.query('api::machine-configuration.machine-configuration').findMany({
      populate: {
        ingredient: true
      },
      orderBy: {
        slot: 'ASC'
      }
    });
    
    try {
      ctx.body = configurations.map(configuration => {
        return {
            slot: configuration.slot,
            measureVolume: configuration.measureVolume,
            ingredientName: configuration.ingredient.name,
            ingredientId: configuration.ingredient.id
        }});
    } catch (err) {
      ctx.body = err;
    }
  },

  async update(ctx){
    const {ingredient, volume} = ctx.request.body;
    const slot = ctx.params.slot;

    if(!slot || !ingredient || !volume){
      return ctx.badRequest('name is missing', "Slot, ingredient and volume are required.")
    }

    if(volume != 25 && volume !=33 && volume != 50){
      return ctx.badRequest('Invalid volume', "Volume must be 25, 33 or 50.")
    }

    if(!(slot >= 1 && slot <= 12)){
      return ctx.badRequest('Invalid slot', "Slot must be between 1 and 12.")
    }

    const ingredientObect = await strapi.db.query('api::ingredient.ingredient').findOne({
        where:{
            id: ingredient
        }
      });
      
    if(!ingredientObect){
        return ctx.badRequest('Invalid ingredient', "Select a valid ingredient id.")
    }

    await strapi.db.query('api::machine-configuration.machine-configuration').delete({
        where: { slot: slot }
        });

    const result = await strapi.db.query('api::machine-configuration.machine-configuration').create({
        data: {
            slot: slot,
            ingredient: ingredient,
            measureVolume: volume
        },
        populate: {
            ingredient: true
        }
      });

    try {
        ctx.body = {
            slot: result.slot,
            measureVolume: result.measureVolume,
            ingredientName: result.ingredient.name,
            ingredientId: result.ingredient.id
        }
      } catch (err) {
        ctx.body = err;
      }
  }
}));