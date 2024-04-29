/*
// Test ID: 02
*/
// This test sees if the exploring similar recipes will deny invalid input
// and accept valid input, and return a new recipe based on the search

// The database is currently mocked, but still properly tests the functions

import exploreSimilarRecipes from "./backend/exploresimilar.js";
import pool from "./backend/db.js";

// TODO Right now the query will return the item that you were also search for, this will change later

describe("exploreSimilarRecipes", () => {
  beforeEach(async () => {
    await pool.query("BEGIN");

    // So an issue here was not being able to insert into this juction table because of not knowing exactly what the IDs were of
    // recipes and ingredients to be able to fill the table. Using SQL alone you can use keyword RETURNING to get the id given
    // to the new rows, which we can reuse. So we collect the IDs, then use them for the junction table.

    const recipeInsertQuery = `
            INSERT INTO recipe (title, directions, description) 
            VALUES ($1, $2, $3), ($4, $5, $6) 
            RETURNING recipeid;`;

    const ingredientInsertQuery = `
            INSERT INTO ingredient (name) 
            VALUES ($1), ($2), ($3), ($4), ($5), ($6) 
            RETURNING ingredientid;`;

    const recipeResults = await pool.query(recipeInsertQuery, [
      "Cake",
      "Mix ingredients... blah.",
      "A nice cake",
      "Cookies",
      "Mix ingredients ...",
      "Tasty cookies",
    ]);
    const ingredientResults = await pool.query(ingredientInsertQuery, [
      "Sugar",
      "Butter",
      "Wheat",
      "Eggs",
      "Milk",
      "Cocoa Powder",
    ]);

    const recipeIds = recipeResults.rows.map((row) => row.recipeid);
    const ingredientIds = ingredientResults.rows.map((row) => row.ingredientid);

    //console.log("Recipe IDs:", recipeIds);
    //console.log("Ingredient IDs:", ingredientIds);

    await pool.query(
      "INSERT INTO recipeIngredients (recipeID, ingredientID) VALUES ($1, $2), ($1, $3), ($1, $4), ($1, $5), ($1, $6), ($1, $7), ($8, $2), ($8, $3), ($8, $4), ($8, $5), ($8, $6)",
      [
        recipeIds[0],
        ingredientIds[0],
        ingredientIds[1],
        ingredientIds[2],
        ingredientIds[3],
        ingredientIds[4],
        ingredientIds[5],
        recipeIds[1],
      ]
    );
  });

  afterEach(async () => {
    await pool.query("ROLLBACK");
  });

  // There is no input that could cause this, the SQL queries themselves would have to be messed up
  it("should have a working connection to the database", async () => {
    await expect(pool.query("SELECT 1;")).resolves.not.toThrow();
  });

  it("should return recipes correctly for valid title and ingredients, including similar recipes", async () => {
    const result = await exploreSimilarRecipes("cake", [
      "wheat",
      "sugar",
      "eggs",
      "butter",
      "milk",
      "cocoa powder",
    ]);

    //expect(result.length).toBe(2);
    expect(result).toEqual(["cake", "cookies"]);
  });

  it("should throw an error if both title and ingredients are empty", async () => {
    await expect(exploreSimilarRecipes("", [])).rejects.toThrow(
      "Both title and ingredients can't be empty"
    );
  });

  it("should throw an error if ingredients are not an array", async () => {
    await expect(exploreSimilarRecipes("", "wheat")).rejects.toThrow(
      "Both title and ingredients can't be empty"
    );
  });

  it("should throw an error when the title is too long", async () => {
    const longTitle =
      "Title to a food that is too many characters, no title is this long so something went wrong";
    await expect(exploreSimilarRecipes(longTitle, ["sugar"])).rejects.toThrow(
      "Title shouldn't be greater than 50 characters"
    );
  });
});

/*

Incoroporated into above tests

*/

// Dummy data for CORRECT input
// const dummyRecipeCorrect = [
//   {
//     title: "cake",
//     ingredients: ["wheat", "sugar", "eggs", "butter", "milk", "cocoa poweder"],
//   },
// ];

// const dummyNoTitle = [
//   {
//     title: "",
//     ingredients: ["wheat", "sugar", "eggs", "butter", "milk", "cocoa poweder"],
//   },
// ];

// const dummyNoIngredients = [
//   {
//     title: "",
//     ingredients: ["wheat", "sugar", "eggs", "butter", "milk", "cocoa poweder"],
//   },
// ];

// // Dummy Data for INCORRECT input
// const dummyRecipeNoTitleNoIngredients = [
//   {
//     title: "",
//     ingredients: [],
//   },
// ];

// const dummyRecipeNoTitleNoIngredients2 = [
//   {
//     title: "",
//     ingredients: "wheat",
//   },
// ];

// const dummyRecipeLongTitle = [
//   {
//     title:
//       "Title to a food that is too many characters, no title is this long so something went wrong",
//     ingredients: [],
//   },
// ];
