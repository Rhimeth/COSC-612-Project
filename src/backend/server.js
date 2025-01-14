/*
Express.js is used for the backend server. Express allegedly just
reduces boilerplate that you'd otherwise need if you wrote it all
inside of node.js instead

The server is currently listening on port 3000
*/

import express from "express"; // Express
import pool from "./db.js"; // Importing pool from db
import LLM from "./LLM.js";
import exploreSimilarRecipes from "./exploresimilar.js";


const app = express();
const port = 3000;
const llm = new LLM();


// Starts server on port 3000
console.log("Starting the server...");
app.listen(port, () => {
  console.log("Server currently running on port: " + port);
});

// Serves the HTML files in this project
app.use(express.static("frontend"));
app.use(express.json());

/*
GET Requests
*/

app.get("/", (req, res) => {
  res.send("sucessful GET request");
});

app.get("/database/fetchmyrecipes", async (req, res) => {
  const { appUserId } = req.query;

  const query = `
  SELECT r.recipeid, r.title, r.measurementingredient, r.directions
  FROM recipe r
  JOIN userrecipes ON r.recipeid = userrecipes.recipeid
  WHERE userrecipes.appuserid = $1;
  `;

  try {
    console.log("at backend try of fetchmyrecipes");
    const results = await pool.query(query, [appUserId]);
    if (results.rows.length > 0) {
      res.json(results.rows);
      console.log("results: ", results.rows);
    } else {
      res.status(404).send("No recipes found for the user.");
    }
    console.log("success");
  } catch (error) {
    console.error("Error retrieving recipes:", error);
    res
      .status(500)
      .send("Failed to retrieve recipes due to an internal error.");
  }
});

app.get("/database/recipeupload", async (req, res) => {
  const { title, measurementingredient, directions } = req.query;

  const createJsonArrayString = (listStr) => {
    const items = listStr.split(/,\s*/); 
    return JSON.stringify(items); 
  };

  const formattedMeasurementIngredient = createJsonArrayString(
    measurementingredient
  );
  const formattedDirections = createJsonArrayString(
    directions.replace(/(\.\s+|\.$)/g, ",")
  );

  const insertRecipeQuery = `
    INSERT INTO recipe (title, measurementingredient, directions)
    VALUES ($1, $2, $3)
    RETURNING recipeid;
  `;

  try {
    await pool.query("BEGIN");
    const recipeResult = await pool.query(insertRecipeQuery, [
      title,
      formattedMeasurementIngredient,
      formattedDirections,
    ]);
    const recipeId = recipeResult.rows[0].recipeid;

    const associateRecipeQuery = `
      INSERT INTO userrecipes (appuserid, recipeid)
      VALUES (1, $1);
    `;
    await pool.query(associateRecipeQuery, [recipeId]);

    await pool.query("COMMIT");
    res.json({ recipeId: recipeId });
  } catch (error) {
    console.error("Error during recipe upload:", error);
    await pool.query("ROLLBACK");
    res.status(500).send("Error uploading recipe");
  }
});

// Tags Search
app.get("/database/tagssearch", async (req, res) => {
  const recipeId = req.query.recipeId;

  const query = `
        SELECT DISTINCT t.name, t.tagid
        FROM tags t
        JOIN ingredienttags it ON it.tagid = t.tagid
        JOIN recipeingredients ri ON ri.ingredientid = it.ingredientid
        JOIN recipe r ON ri.recipeid = r.recipeid
        WHERE r.recipeid = $1
    `;

  try {
    console.log("At backend /taggsearch try block");
    const results = await pool.query(query, [recipeId]);
    res.json(results.rows.map((row) => ({ name: row.name, tagId: row.tagid })));
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    res.status(500).send("Error fetching tags");
  }
});

// LLM Search
app.get("/database/llmsearch", async (req, res) => {
  try {
    console.log("At backend /llmsearch try block");
    const prompt = req.query.q;
    const results = await llm.query(prompt);
    console.log(results);
    res.json(results);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Explore Similar
app.get("/database/exploresimilar", async (req, res) => {
  try {
    console.log("at backend try of exploresimilar");
    const { recipeid } = req.query;
    console.log(recipeid);
    if (!recipeid) {
      return res.status(400).json({ error: "No recipe ID provided" });
    }

    const results = await exploreSimilarRecipes(recipeid);
    console.log("Matched recipes:", results);
    res.json(results);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Title Search
app.get("/database/titlesearch", async (req, res) => {
  // This setup gives priority to exact matching, then matching 4 words, 3, words, ect
  const { searchTitle, culinaryPreference } = req.query;

  console.log("culnary preferece is: ", culinaryPreference);

  const searchWords = searchTitle.split(/\s+/);
  const twoWordPatterns = searchWords
    .map((_, i, arr) => arr[i] + " " + arr[i + 1])
    .filter(Boolean);
  const threeWordPatterns = searchWords
    .map((_, i, arr) => arr[i] + " " + arr[i + 1] + " " + arr[i + 2])
    .filter(Boolean);
  const searchPattern = [
    ...threeWordPatterns,
    ...twoWordPatterns,
    ...searchWords,
  ].join("|");

  let excludeTags;

  switch (culinaryPreference) {
    case "Vegan":
      excludeTags = ["poultry", "beef", "pork", "fish", "dairy"];
      break;
    case "Vegetarian":
      excludeTags = ["poultry", "beef", "pork", "fish"];
      break;
    case "Dairyfree":
      excludeTags = ["dairy"];
      break;
    default:
      excludeTags = null;
  }

  console.log("we are going to try to exclude: ", excludeTags);

  const sqlTitleSearch = `
    SELECT r.RecipeID, r.Title, r.directions, r.measurementingredient,
      CASE
        WHEN r.Title ILIKE $1 THEN 1
        WHEN r.Title ~* $2 THEN 2
        ELSE 3
      END AS Priority
    FROM Recipe r
    JOIN recipeingredients ri ON ri.recipeid = r.recipeid
    JOIN ingredienttags it ON it.ingredientid = ri.ingredientid
    JOIN tags t ON t.tagid = it.tagid
    WHERE (r.Title ILIKE $1 OR r.Title ~* $2)
      AND r.RecipeID NOT IN (
        SELECT ri2.recipeid
        FROM recipeingredients ri2
        JOIN ingredienttags it2 ON it2.ingredientid = ri2.ingredientid
        JOIN tags t2 ON t2.tagid = it2.tagid
        WHERE LOWER(t2.name) = ANY($3)
      )
    GROUP BY r.RecipeID, r.Title, r.directions, r.measurementingredient
    ORDER BY Priority, r.Title
    LIMIT 20;
    `;

  try {
    console.log("made it to the backend try statement");
    const results = await pool.query(sqlTitleSearch, [
      `%${searchTitle}%`, // Exact title match
      searchPattern,
      excludeTags,
    ]);
    console.log("just finished query, going to send response");
    console.log(results.rows);
    res.json(results.rows);
    console.log("response sent");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error in responding to title search");
  }
});


app.get("/database/getallfavorites", async (req, res) => {
  const { appUserId } = req.query;
  const sql = `
    SELECT r.* FROM favorites f
    JOIN recipe r ON f.recipeId = r.recipeId
    WHERE f.appUserId = $1
  `;

  try {
    const result = await pool.query(sql, [appUserId]);
    if (result.rows.length > 0) {
      res.json(result.rows);
    } else {
      res.status(404).json({ message: "No favorites found" });
    }
    console.log("results: ", result.rows);
  } catch (error) {
    console.error("Error retrieving favorites:", error);
    res.status(500).json({ error: "Failed to retrieve favorites" });
  }
});

// Used by Recipe View page
app.get("/database/checkfavorite", async (req, res) => {
  const { recipeId, appUserId } = req.query;
  const sql = "SELECT 1 FROM favorites WHERE appUserId = $1 AND recipeId = $2";

  try {
    const result = await pool.query(sql, [appUserId, recipeId]);
    res.json({ isFavorited: result.rows.length > 0 });
  } catch (err) {
    console.error("Error checking favorite status:", err);
    res.status(500).json({ error: "Failed to check favorite status" });
  }
});

// Used by Favorites page
app.get("/database/getallfavorites", async (req, res) => {
  const { appUserId } = req.query;
  const sql = "SELECT recipeId FROM favorites WHERE appUserId = $1";

  try {
    console.log("At backend /getallfavorite try block");
    const result = await pool.query(sql, [appUserId]);
    console.log("query ran, checking length: ", result.rows.length);

    if (result.rows.length > 0) {
      res.json(result.rows);
    } else {
      res.status(404).json({ message: "No favorites found" });
    }
  } catch (error) {
    console.error("Error retrieving favorites:", error);
    res.status(500).json({ error: "Failed to retrieve favorites" });
  }
});

/*
POST Requests
*/

// Toggling favorites on and off

app.post("/database/addfavorite", async (req, res) => {
  const { recipeId, appUserId } = req.body;
  const sql = "INSERT INTO favorites (appUserId, recipeId) VALUES ($1, $2)";

  try {
    await pool.query(sql, [appUserId, recipeId]);
    res.json({ message: "favorite added" });
  } catch (error) {
    console.error("error adding favorite:", error);
    res.status(500).json({ error: "Failed to add favorite" });
  }
});

app.post("/database/removefavorite", async (req, res) => {
  const { recipeId, appUserId } = req.body;
  const sql = "DELETE FROM favorites WHERE appUserId = $1 AND recipeId = $2";

  try {
    console.log(recipeId, appUserId);
    await pool.query(sql, [appUserId, recipeId]);
    res.json({ message: "favorite removed" });
    console.log("favorite removed");
  } catch (error) {
    console.error("error removing favorite:", error);
    res.status(500).json({ error: "Failed to add favorite" });
  }
});

// Registering
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Check if user exists
  try {
    console.log("Check if user exists...");
    const userExists = await pool.query(
      "SELECT * FROM AppUser WHERE username = $1",
      [username]
    );

    if (userExists.rows.length > 0) {
      console.log("The user already exists");
      return res.json({ success: false, message: "Username already taken" });
    }

    // Insert user
    console.log("Attempting to insert appuser data");
    await pool.query(
      "INSERT INTO AppUser (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, password]
    );
    res.json({ success: true, message: "User was registered" });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: "User registration failed" });
  }
});

// Getting user's user name and email, which I realize you
// would need to already know the user's username... which is a problem
app.get("/getUserInfo", async (req, res) => {
  const { username } = req.query;

  try {
    const result = await pool.query(
      "SELECT username, email FROM AppUser WHERE username = $1",
      [username]
    );
    if (result.rows.length > 0) {
      res.json({ success: true, data: result.rows[0] });
    } else {
      res.json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// TODO login page
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    console.log("Attempting to log in");
    const user = await pool.query(
      "SELECT * FROM AppUser WHERE username = $1 AND password = $2",
      [username, password]
    );
    if (user.rows.length > 0) {
      console.log("Login successful");
      res.json({ success: true, message: "Login successful" });
    } else {
      console.log("Login failed: Incorrect username or password");
      res.json({ success: false, message: "Incorrect username or password" });
    }
  } catch (error) {
    console.error("Database error during login:", error.message);
    res.status(500).send("Server error during login");
  }
});
