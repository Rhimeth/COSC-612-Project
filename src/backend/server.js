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

const llm = new LLM();
const app = express();
const port = 3000;

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

// LLM Search
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
    console.log("At backend /explorersimilar try block");
    //const prompt = req.query.q
    const results = await exploreSimilarRecipes();
    console.log(results);
    res.json(results);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Title Search
app.get("/database/titlesearch", async (req, res) => {
  // This setup gives priority to exact matching, then matching 4 words, 3, words, ect
  const searchTitle = req.query.q;
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

  const sqlTitleSearch = `
      SELECT r.RecipeID, r.Title, r.directions, r.measurementingredient,
        CASE
          WHEN r.Title ILIKE $1 THEN 1
          WHEN r.Title ~* $2 THEN 2
          ELSE 3
        END AS Priority
      FROM Recipe r
      WHERE r.Title ILIKE $1 OR r.Title ~* $2
      ORDER BY Priority, r.Title
      LIMIT 10`;

  try {
    console.log("made it to the backend try statement");
    const results = await pool.query(sqlTitleSearch, [
      `%${searchTitle}%`, // Exact title match
      searchPattern,
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
