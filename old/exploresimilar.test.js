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

    await pool.query(
      "INSERT INTO recipe (title, directions, description) VALUES ($1, $2, $3), ($4, $5, $6)",
      [
        "Cake",
        "Mix ingredients... blah.",
        "A nice cake",
        "Cookies",
        "Mix ingredients ...",
        "Tastey cookies",
      ]
    );

    await pool.query(
      "INSERT INTO ingredient (name) VALUES ($1), ($2), ($3), ($4), ($5), ($6)",
      ["Sugar", "Butter", "Wheat", "Eggs", "Milk", "Cocoa Powder"]
    );

    await pool.query(
      "INSERT INTO recipeIngredients (recipeID, ingredientID) VALUES (1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (2, 1), (2, 2), (2, 3), (2, 4)"
    );
  });

  afterEach(async () => {
    await pool.query("ROLLBACK");
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

    expect(result.length).toBe(2);
    expect(result).toEqual([
      {
        Title: "cake",
        RecipeID: "1",
        Ingredients: "sugar, butter, wheat, eggs, milk, cocoa powder",
      },
      {
        Title: "cookies",
        RecipeID: "2",
        Ingredients: "sugar, butter, wheat, eggs",
      },
    ]);
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

  it("should throw errors if query can't be run", async () => {
    // Simulating a database error, e.g., bad query
    await expect(
      exploreSimilarRecipes("invalid", ["nonexistent"])
    ).rejects.toThrow();
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
