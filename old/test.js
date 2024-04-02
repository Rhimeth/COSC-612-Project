/* 
Each test is part of a transaction (BEGIN). 
This way we can revert state back to the original database (ROLLBACK).
Data is added for each test if it is needed.
User: actions the user can take
Admin: can do all user action in addtion to other actions
*/

// May need these between tests, but I don't think so
// afterAll(async () => await pool.end());
// beforeAll(async () => await pool.open());

import pool from "./backend/db.js"; // Importing pool from db.js

// AppUser Table Test
// User: update password, delete their account
// Admin: getting all users

describe("AppUser Table", () => {
  beforeEach(async () => {
    await pool.query("BEGIN");
    await pool.query(
      "INSERT INTO AppUser (AppUserID, Username, Password, Created_At) VALUES ($1, $2, $3, $4)",
      [1, "testuser", "originalpassword", new Date()]
    );
  });

  afterEach(async () => await pool.query("ROLLBACK"));

  it("should retrieve an AppUser", async () => {
    const res = await pool.query("SELECT * FROM AppUser WHERE Username = $1", [
      "testuser",
    ]);
    expect(res.rows.length).toBe(1);
    expect(res.rows[0].username).toEqual("testuser");
  });

  it("should update an AppUsers password", async () => {
    await pool.query("UPDATE AppUser SET Password = $1 WHERE Username = $2", [
      "newpassword",
      "testuser",
    ]);
    const res = await pool.query("SELECT * FROM AppUser WHERE Username = $1", [
      "testuser",
    ]);
    expect(res.rows[0]).toHaveProperty("password", "newpassword");
  });

  it("should delete an AppUser", async () => {
    await pool.query("DELETE FROM AppUser WHERE Username = $1", ["testuser"]);
    const res = await pool.query("SELECT * FROM AppUser WHERE Username = $1", [
      "testuser",
    ]);
    expect(res.rows.length).toBe(0);
  });
});

// AppUser Search History Test (LLMSearch or LLMSearchResult as null)
// User: retrieving history, deleting history
// Admin: none
describe("SearchHistory Table Operations", () => {
  beforeEach(async () => {
    await pool.query("BEGIN");
    const userRes = await pool.query(
      "INSERT INTO AppUser (AppUserID, Username, Password, Created_At) VALUES ($1, $2, $3, $4) RETURNING AppUserID",
      [1, "testuser", "originalpassword", new Date()]
    );
    await pool.query(
      "INSERT INTO SearchHistory (SearchID, AppUserID, SearchTerm, LLMSearch, LLMSearchResult) VALUES ($1, $2, $3, $4, $5)",
      [1, 1, "eggs", null, null]
    );
    await pool.query(
      "INSERT INTO SearchHistory (SearchID, AppUserID, SearchTerm, LLMSearch, LLMSearchResult) VALUES ($1, $2, $3, $4, $5)",
      [2, 1, "fish", null, null]
    );
  });

  afterEach(async () => await pool.query("ROLLBACK"));

  it("should retrieve all search history", async () => {
    const res = await pool.query(
      "SELECT * FROM SearchHistory WHERE AppUserID = $1",
      [1]
    );
    expect(res.rows.length).toBe(2);
    expect(res.rows[0].searchterm).toEqual("eggs");
    expect(res.rows[1].searchterm).toEqual("fish");
  });

  it("should delete a SearchHistory record for a user", async () => {
    await pool.query("DELETE FROM SearchHistory WHERE AppUserID = $1", [1]);
    const res = await pool.query(
      "SELECT * FROM SearchHistory WHERE AppUserID = $1",
      [1]
    );
    expect(res.rows.length).toBe(0);
  });
});

// Add tags
// User: none
// Admin: add new tags
describe("Tags Table Operations", () => {
  beforeEach(async () => {
    await pool.query("BEGIN");
    await pool.query("INSERT INTO Tags (TagID, Name) VALUES ($1, $2)", [
      1,
      "spicy",
    ]);
  });

  afterEach(async () => await pool.query("ROLLBACK"));

  it("should read the inserted tag", async () => {
    const res = await pool.query("SELECT * FROM Tags WHERE name = $1", [
      "spicy",
    ]);
    expect(res.rows.length).toBe(1);
    expect(res.rows[0].name).toEqual("spicy");
  });
});

// Recipes Tests
// User: get recipe
// Admin: update recipe description, delete recipe
describe("Recipe Table", () => {
  beforeEach(async () => {
    await pool.query("BEGIN");
    await pool.query(
      "INSERT INTO Recipe (RecipeID, Directions, Description, Title) VALUES ($1, $2, $3, $4)",
      [
        1,
        "Mix ingredients in a pan, bake at 425",
        "A basic cake recipe",
        "Cake",
      ]
    );
  });
  afterEach(async () => await pool.query("ROLLBACK"));

  it("should retrieve a Recipe", async () => {
    const res = await pool.query("SELECT * FROM Recipe WHERE Title = $1", [
      "Cake",
    ]);
    expect(res.rows.length).toBe(1);
    expect(res.rows[0].title).toEqual("Cake");
  });

  it("should update a Recipe's description", async () => {
    await pool.query("UPDATE Recipe SET Description = $1 WHERE Title = $2", [
      "A classic cake recipe",
      "Cake",
    ]);
    const res = await pool.query("SELECT * FROM Recipe WHERE Title = $1", [
      "Cake",
    ]);
    expect(res.rows[0]).toHaveProperty("description", "A classic cake recipe");
  });

  it("should delete a Recipe", async () => {
    await pool.query("DELETE FROM Recipe WHERE Title = $1", ["Cake"]);
    const res = await pool.query("SELECT * FROM Recipe WHERE Title = $1", [
      "Cake",
    ]);
    expect(res.rows.length).toBe(0);
  });
});

// Recipe Tests
// User:
// Admin:
describe("Ingredient Table", () => {
  beforeEach(async () => {
    await pool.query("BEGIN");
    await pool.query(
      "INSERT INTO Ingredient (IngredientID, Name) VALUES ($1, $2)",
      [1, "Flour"]
    );
  });

  afterEach(async () => await pool.query("ROLLBACK"));

  it("should retrieve an Ingredient", async () => {
    const res = await pool.query("SELECT * FROM Ingredient WHERE Name = $1", [
      "Flour",
    ]);
    expect(res.rows.length).toBe(1);
    expect(res.rows[0].name).toEqual("Flour");
  });

  it("should update an Ingredient's name", async () => {
    await pool.query("UPDATE Ingredient SET Name = $1 WHERE Name = $2", [
      "Whole Wheat Flour",
      "Flour",
    ]);
    const res = await pool.query("SELECT * FROM Ingredient WHERE Name = $1", [
      "Whole Wheat Flour",
    ]);
    expect(res.rows[0]).toHaveProperty("name", "Whole Wheat Flour");
  });

  it("should delete an Ingredient", async () => {
    await pool.query("DELETE FROM Ingredient WHERE Name = $1", ["Flour"]);
    const res = await pool.query("SELECT * FROM Ingredient WHERE Name = $1", [
      "Flour",
    ]);
    expect(res.rows.length).toBe(0);
  });
});

// Favorites Test
// User: get favorites, delete a favorite
// Admin: none
describe("Favorites Table", () => {
  beforeEach(async () => {
    await pool.query("BEGIN");
    // Insert necessary data into AppUser
    await pool.query(
      "INSERT INTO AppUser (AppUserID, Username, Password, Created_At) VALUES ($1, $2, $3, $4)",
      [1, "testuser", "testpass", new Date()]
    );
    // Insert necessary data into Recipe
    await pool.query(
      "INSERT INTO Recipe (RecipeID, Directions, Description, Title) VALUES ($1, $2, $3, $4)",
      [1, "Mix well", "A delicious cake", "Cake"]
    );
    // Now insert into Favorites
    await pool.query(
      "INSERT INTO Favorites (AppUserID, RecipeID, Favorited_At) VALUES ($1, $2, $3)",
      [1, 1, new Date()]
    );
  });

  afterEach(async () => await pool.query("ROLLBACK"));

  it("should retrieve a Favorite by AppUserID", async () => {
    const res = await pool.query(
      "SELECT * FROM Favorites WHERE AppUserID = $1",
      [1]
    );
    expect(res.rows.length).toBe(1);
    expect(res.rows[0].appuserid).toEqual(1);
  });

  it("should delete a Favorite", async () => {
    await pool.query(
      "DELETE FROM Favorites WHERE AppUserID = $1 AND RecipeID = $2",
      [1, 1]
    );
    const res = await pool.query(
      "SELECT * FROM Favorites WHERE AppUserID = $1 AND RecipeID = $2",
      [1, 1]
    );
    expect(res.rows.length).toBe(0);
  });
});

// UserRecipe Tests
// User: get a user recupe, delete a user recipe, update a user recipe
// Admin: none
describe("UserRecipes Table", () => {
  beforeEach(async () => {
    await pool.query("BEGIN");
    // Insert necessary data into AppUser
    await pool.query(
      "INSERT INTO AppUser (AppUserID, Username, Password, Created_At) VALUES ($1, $2, $3, $4)",
      [1, "testuser", "testpass", new Date()]
    );
    // Insert necessary data into Recipe
    await pool.query(
      "INSERT INTO Recipe (RecipeID, Directions, Description, Title) VALUES ($1, $2, $3, $4)",
      [1, "Mix well", "A delicious stew", "Stew"]
    );
    // Now insert into UserRecipes
    await pool.query(
      "INSERT INTO UserRecipes (AppUserID, RecipeID, Uploaded_At) VALUES ($1, $2, $3)",
      [1, 1, new Date()]
    );
  });

  afterEach(async () => await pool.query("ROLLBACK"));

  it("should retrieve a UserRecipe by AppUserID", async () => {
    const res = await pool.query(
      "SELECT * FROM UserRecipes WHERE AppUserID = $1",
      [1]
    );
    expect(res.rows.length).toBe(1);
    expect(res.rows[0].appuserid).toEqual(1);
  });

  it("should delete a UserRecipe", async () => {
    await pool.query(
      "DELETE FROM UserRecipes WHERE AppUserID = $1 AND RecipeID = $2",
      [1, 1]
    );
    const res = await pool.query(
      "SELECT * FROM UserRecipes WHERE AppUserID = $1 AND RecipeID = $2",
      [1, 1]
    );
    expect(res.rows.length).toBe(0);
  });
});