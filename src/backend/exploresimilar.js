import pool from "./db.js"; // Importing pool from db

async function exploreSimilarRecipes(recipeid) {
  console.log("at backend function exploreSimilarRecipes()");

  const ingredientQuery = `
    SELECT LOWER(Ingredient.Name) as name
    FROM RecipeIngredients
    JOIN Ingredient ON RecipeIngredients.IngredientID = Ingredient.IngredientID
    WHERE RecipeIngredients.RecipeID = $1
  `;
  const ingredientResults = await pool.query(ingredientQuery, [recipeid]);
  console.log("ingredient results", ingredientResults);

  const ingredients = ingredientResults.rows.map((row) =>
    row.name.toLowerCase()
  );

  // Find recipes with the same ingredients
  const queryIngredients = `
    SELECT Recipe.*
    FROM Recipe
    JOIN RecipeIngredients ON RecipeIngredients.RecipeID = Recipe.RecipeID
    JOIN Ingredient ON RecipeIngredients.IngredientID = Ingredient.IngredientID
    WHERE LOWER(Ingredient.Name) = ANY($1)
    GROUP BY Recipe.RecipeID
    HAVING COUNT(DISTINCT LOWER(Ingredient.Name)) >= $2
  `;

  const matchResults = await pool.query(queryIngredients, [
    ingredients,
    ingredients.length - 2,
  ]);
  return matchResults.rows;
}

export default exploreSimilarRecipes;
