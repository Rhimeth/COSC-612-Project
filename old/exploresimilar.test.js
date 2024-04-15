/*
// Test ID: 02
*/
// This test sees if the exploring similar recipes will deny invalid input
// and accept valid input, and return a new recipe based on the search

// The database is currently mocked, but still properly tests the functions

import exploreSimilarRecipes from "./backend/exploresimilar.js";
import pool from "./backend/db.js";
import { jest } from "@jest/globals";

jest.mock("./backend/db.js", () => ({
  query: jest.fn().mockReturnThis(),
}));

pool.query.mockResolvedValueOnce = jest.fn().mockResolvedValueOnce;
pool.query.mockRejectedValue = jest.fn().mockRejectedValue;

// TODO Right now the query will return the item that you were also search for, this will change later
describe("exploreSimilarRecipes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return recipes correctly for valid title and ingredients, including similar recipes", async () => {
    // Mocking the database response to simulate two sets of title searches and one set of ingredient searches
    pool.query
      .mockResolvedValueOnce({
        rows: [{ title: "cake" }], // Response for title search
      })
      .mockResolvedValueOnce({
        rows: [{ title: "cookies" }], // Response for ingredient search
      })
      .mockResolvedValueOnce({
        rows: [
          {
            Title: "cake",
            RecipeID: "1",
            Ingredients: "sugar, butter, eggs, milk, cocoa powder",
          },
          {
            Title: "cookies",
            RecipeID: "2",
            Ingredients: "sugar, butter, wheat, eggs",
          },
        ], 
      });

    const result = await exploreSimilarRecipes("cake", [
      "wheat",
      "sugar",
      "eggs",
      "butter",
      "milk",
      "cocoa powder",
    ]);

    expect(result).toEqual([
      {
        Title: "cake",
        RecipeID: "1",
        Ingredients: "sugar, butter, eggs, milk, cocoa powder",
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

  //
  it("should throw error if the query can't be performed", async () => {
    pool.query.mockRejectedValue(new Error("SQL Error")); //if on live change to what postgres returns
    await expect(
      exploreSimilarRecipes("cake", [
        "wheat",
        "sugar",
        "eggs",
        "butter",
        "milk",
        "cocoa powder",
      ])
    ).rejects.toThrow("Couldn't execute any queries");
  });

  // Additional tests can be written for cases like valid inputs but empty results.
});

/*

Incoroporated into above tests

*/

// Dummy data for CORRECT input
const dummyRecipeCorrect = [
  {
    title: "cake",
    ingredients: ["wheat", "sugar", "eggs", "butter", "milk", "cocoa poweder"],
  },
];

const dummyNoTitle = [
  {
    title: "",
    ingredients: ["wheat", "sugar", "eggs", "butter", "milk", "cocoa poweder"],
  },
];

const dummyNoIngredients = [
  {
    title: "",
    ingredients: ["wheat", "sugar", "eggs", "butter", "milk", "cocoa poweder"],
  },
];

// Dummy Data for INCORRECT input
const dummyRecipeNoTitleNoIngredients = [
  {
    title: "",
    ingredients: [],
  },
];

const dummyRecipeNoTitleNoIngredients2 = [
  {
    title: "",
    ingredients: "wheat",
  },
];

const dummyRecipeLongTitle = [
  {
    title:
      "Title to a food that is too many characters, no title is this long so something went wrong",
    ingredients: [],
  },
];
