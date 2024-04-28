/*
Express.js is used for the backend server. Express allegedly just
reduces boilerplate that you'd otherwise need if you wrote it all
inside of node.js instead

The server is currently listening on port 3000
*/

import express from "express"; // Express
import pool from "./db.js"; // Importing pool from db
import LLM from "./LLM.js";

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

app.get('/', (req, res) => {
  res.send('sucessful GET request');
});

// Title Search
app.get("/database/titlesearch", async (req, res) => {
  const searchTitle = req.query.q;
  const searchWords = searchTitle.split(/\s+/); // So we can search by words
  const searchPattern = searchWords.join("|"); // recombine to match 2 or 3

  const sqlTitleSearch = `
      SELECT r.RecipeID, r.Title, r.Description,
        CASE
          WHEN r.Title ILIKE $1 THEN 1
          WHEN r.Title ~* $2 THEN 2
          ELSE 3
        END AS Priority
      FROM Recipe r
      WHERE r.Title ILIKE $1 OR r.Title ~* $2
      ORDER BY Priority, r.Title
      LIMIT 20;`;

  try {
    console.log("made it to the backend try statement");
    const results = await pool.query(sqlTitleSearch, [
      `%${searchTitle}%`,
      searchPattern,
    ]);
    console.log("just finished query, going to send response");
    console.log(results.rows);
    console.log("response sent");
    
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// LLM Search
app.get("/database/LLMsearch"),
  (req, res) => {
    try {
      console.log("made it to the backend try statement");
      const { prompt } = req.query.q;
      results = llm.query(prompt);
      res.json(results.rows);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  };

/*
POST Requests
*/

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
    const result = await pool.query(
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
