/*
This function is to explore similar recipes.
When the user is viewing a recipe they should click "explore"
*/

import pool from "./db.js"; // Importing pool from db

async function exploreSimilarRecipes(title, ingredients) {
  if (!title && (!Array.isArray(ingredients) || ingredients.length === 0)) {
    throw new Error("Both title and ingredients can't be empty");
    return;
  }

  if (title.length > 50) {
    throw new Error("Title shouldn't be greater than 50 characters");
    return;
  }

  // Pre-process the title string into array of words, if title was given
  if (title) {
    let titleWords = title.toLowerCase().split(/\s+/).filter(Boolean);
  }

  const queryTitles = `SELECT Title FROM Recipe WHERE LOWER(Title) LIKE ANY ($1)`;

  // TODO Possibly match 3, or 5 instead?
  const queryIngredients = `
    SELECT Title FROM Recipe 
    JOIN RecipeIngredients ON RecipeIngredients.RecipeID
    JOIN Ingredient ON RecipeIngredients.IngredientID = Ingredient.IngredientID
    WHERE Ingrient.Name = ANY($1)
    GROUP BY Recipe.RecipeID
    HAVING COUNT(DISTINCT Ingredient.Name) >=4
  `;

  try {
    // Query for titles based on title
    const titleRes = await pool.query(queryTitles, [title]);
    const titleMatches = titleRes.rows.map((row) => row.title);

    // Query for title based on ingredients
    const ingredientRes = await pool.query(queryIngredients, [ingredients]);
    const ingredientMatches = ingredientRes.rows.map((row) => row.title);

    // Combine results
    const allMatches = Array.from(
      new Set([...titleMatches, ...ingredientMatches])
    );

    // Query for all data to be sent to frontend
    const queryRecipes = `SELECT * FROM Recipe WHERE Title = ANY($1)`;
    const finalRes = await pool.query(queryRecipes, [allMatches]);

    return finalRes.rows; // Return full rows with recipe data
  } catch (err) {
    console.error(err);
    throw new Error("Couldn't execute any queries");
  }
}

export default exploreSimilarRecipes;
