'use strict';

/**
 * recipe controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::recipe.recipe', ({ strapi }) => ({
    async available(ctx) {

      const availableIngredients = await strapi.db.query('api::machine-configuration.machine-configuration').findMany({
        populate: {
          ingredient: true
        }
      });

      const recipes = await strapi.db.query('api::recipe.recipe').findMany({
        populate: {
          picture: true
        }
      });

      const recipesIngredients = await strapi.db.query('api::recipe-ingredient.recipe-ingredient').findMany({
        populate: {
          ingredient: true,
          recipe: true
        }
      });

      let availableRecipes = [];

      recipes.forEach(recipe => {
        const recipeIngredients = recipesIngredients.filter(ingredient => ingredient.recipe.id == recipe.id).map(ingredient => {
          return {
            id: ingredient.ingredient.id,
            proportion: ingredient.proportion,
            order: ingredient.order,
            name: ingredient.ingredient.name,
            isAlcohol: ingredient.ingredient.isAlcohol,
            alcoholDegree: ingredient.ingredient.alcoholDegree
          }
        });

        let isAvailable = true;
        recipeIngredients.forEach(ingredient => {
          if(!availableIngredients.find(available => available.ingredient.id == ingredient.id)){
            isAvailable = false;
          }
        });
        
        if(isAvailable){
          availableRecipes.push({
              id: recipe.id,
              name: recipe.name,
              description: recipe.description,
              alcoholLevel: recipe.alcoholLevel,
              alcoholMinLevel: recipe.alcoholMinLevel,
              alcoholMaxLevel: recipe.alcoholMaxLevel,
              picture: recipe.picture.formats.small ? recipe.picture.formats.small.url : recipe.picture.formats.thumbnail.url,
              ingredients: recipeIngredients
          });
        }
      });
      
      try {
        ctx.body = availableRecipes;
      } catch (err) {
        ctx.body = err;
      }
    },

    async find(ctx) {

      const availableIngredients = await strapi.db.query('api::machine-configuration.machine-configuration').findMany({
        populate: {
          ingredient: true
        }
      });

      const recipes = await strapi.db.query('api::recipe.recipe').findMany({
        populate: {
          picture: true
        }
      });

      const recipesIngredients = await strapi.db.query('api::recipe-ingredient.recipe-ingredient').findMany({
        populate: {
          ingredient: true,
          recipe: true
        }
      });

      let availableRecipes = [];

      recipes.forEach(recipe => {
        const recipeIngredients = recipesIngredients.filter(ingredient => ingredient.recipe.id == recipe.id).map(ingredient => {
          return {
            id: ingredient.ingredient.id,
            proportion: ingredient.proportion,
            order: ingredient.order,
            name: ingredient.ingredient.name,
            isAlcohol: ingredient.ingredient.isAlcohol,
            alcoholDegree: ingredient.ingredient.alcoholDegree
          }
        });

        let isAvailable = true;
        recipeIngredients.forEach(ingredient => {
          if(!availableIngredients.find(available => available.ingredient.id == ingredient.id)){
            isAvailable = false;
          }
        });
 
        availableRecipes.push({
            id: recipe.id,
            name: recipe.name,
            description: recipe.description,
            alcoholLevel: recipe.alcoholLevel,
            alcoholMinLevel: recipe.alcoholMinLevel,
            alcoholMaxLevel: recipe.alcoholMaxLevel,
            picture: recipe.picture.formats.small ? recipe.picture.formats.small.url : recipe.picture.formats.thumbnail.url,
            ingredients: recipeIngredients,
            isAvailable,
        });
      });
      
      try {
        ctx.body = availableRecipes;
      } catch (err) {
        ctx.body = err;
      }
    },

    async update(ctx) {
      const { id } = ctx.params;
      const { data } = ctx.request.body;

      const ingredientsData = data.ingredients
      const recipeData = data
      delete recipeData.ingredients

      const recipe = await strapi.db.query('api::recipe.recipe').update({
        where: { id },
        data: recipeData
      });

      const recipeIngredients = await strapi.db.query('api::recipe-ingredient.recipe-ingredient').findMany({
        where: { recipe: { id } }
      });

      for (const recipeIngredient of recipeIngredients) {
        await strapi.db.query('api::recipe-ingredient.recipe-ingredient').delete({
          where: { id: recipeIngredient.id }
        });
      }

      recipe.ingredients = [];

      for (const ingredientData of ingredientsData) {
        const newIngredient = await strapi.db.query('api::recipe-ingredient.recipe-ingredient').create({
          data: {
            recipe: {
              connect: { id: recipe.id }
            },
            ingredient: {
              connect: { id: ingredientData.id }
            },
            proportion: ingredientData.proportion,
            order: ingredientData.order
          }
        });
        recipe.ingredients.push(newIngredient);
      }

      try {
        ctx.body = recipe;
      } catch (err) {
        ctx.body = err;
      }
    }
}));
