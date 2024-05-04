import { Typography, Box } from "@mui/material";
import { useEffect, useState } from "react";
import * as Buttons from "@mui/material";
import * as Icons from "@mui/icons-material";
//TODO used instead of div import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import LLMResults from "../components/LLMResults";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import RecipeCard from "../components/RecipeCard";

import "../styles.css";

const buttonStyle = {
  backgroundColor: "green",
  color: "white",
  padding: "0.5rem 1rem",
  margin: "10px",
  borderRadius: "0.25rem",
  textTransform: "none",
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: "darkgreen",
  },
  "&:active": {
    backgroundColor: "#005700",
    boxShadow: "inset 0 0.125rem 0.25rem rgba(0,0,0,0.1)",
  },
  "&:disabled": {
    backgroundColor: "#cccccc",
    color: "#666666",
  },
};

const textboxStyle = {
  width: "30rem",
  backgroundColor: "white",
};

export default function Search() {
  // Searching by title
  const [titleSearch, setTitleSearch] = useState("");
  const [titleSearchResults, setTitleSearchResults] = useState([]);
  const [culinaryPreference, setCulinaryPreference] = useState("");

  // Search with LLM
  const [llmSearch, setLlmSearch] = useState("");
  const [llmSearchResults, setLlmResults] = useState([]);

  useEffect(() => {
    console.log(
      "(use effect) Culinary preference updated to:",
      culinaryPreference
    );
  }, [culinaryPreference]);

  // Title Search
  const handleTitleSearch = async () => {
    console.log("Entering handleTitleSearch");
    if (!titleSearch) {
      alert("Search can't be empty");
      return;
    }

    try {
      console.log("at frontend try of search");

      const encodedTitleSearch = encodeURIComponent(titleSearch);
      const encodedCulinaryPreference = encodeURIComponent(culinaryPreference);

      const url = `/api/database/titlesearch?searchTitle=${encodedTitleSearch}&culinaryPreference=${encodedCulinaryPreference}`;

      const response = await fetch(url);
      let data = await response.json();
      console.log("Data received:", data);
      data = data.map((item) => ({
        ...item,
        directions: JSON.parse(item.directions),
        measurementingredient: JSON.parse(item.measurementingredient),
      }));
      setTitleSearchResults(data);
    } catch (error) {
      console.error("Unable to fetch data due to", error);
      setTitleSearchResults([]); // Clear results if it errors
    }
  };

  // LLM Search
  const handleLLMSearch = async () => {
    if (llmSearch.length <= 10) {
      alert("LLM search must be more than 10 characters");
      return;
    } else {
      try {
        console.log("At the frontend LLM try block");
        const response = await fetch(
          `/api/database/llmsearch?q=${encodeURIComponent(llmSearch)}`
        );
        const data = await response.json();
        setLlmResults(data);
      } catch (error) {
        console.error("Error querying LLM:", error);
        setLlmResults([]); // had to clear results if it errors
      }
    }
  };

  return (
    <div className="super-container">
      <Box className="myrecipes" sx={{ flexGrow: 1, padding: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Search
        </Typography>
      </Box>
      <div className="search-container">
        <div className="title-search-container">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mt: 6,
              bgcolor: "white",
              padding: "0.5rem"
            }}
          >
            <TextField
              fullWidth
              label="Title Search"
              variant="outlined"
              placeholder="Enter title here..."
              value={titleSearch}
              onChange={(e) => setTitleSearch(e.target.value)}
              sx={{ flexGrow: 3 }}
            />
            <FormControl sx={{ width: "20rem", bgcolor: "white" }}>
              <InputLabel id="culinary-preference-select-label">
                Culinary Preference
              </InputLabel>
              <Select
                labelId="culinary-preference-select-label"
                id="culinary-preference-select"
                value={culinaryPreference}
                label="Culinary Preference"
                onChange={(e) => setCulinaryPreference(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Vegan">Vegan</MenuItem>
                <MenuItem value="Vegetarian">Vegetarian</MenuItem>
                <MenuItem value="Dairyfree">Dairy-Free</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <div>
            <Buttons.Button
              variant="contained"
              startIcon={<Icons.Search />}
              onClick={handleTitleSearch}
              sx={{ ...buttonStyle, mb: "5rem" }}
            >
              Search Title
            </Buttons.Button>
          </div>
          <div>
            <h2>--------------Title Results--------------</h2>
          </div>
          <div className="title-search-results">
            {titleSearchResults.map((searchResult) => (
              <div
                className="recipe-card-container"
                key={searchResult.recipeid}
              >
                <RecipeCard recipe={searchResult} detailed={false} />
              </div>
            ))}
          </div>
        </div>
        <Divider
          orientation="vertical"
          flexItem
          sx={{ width: "1px", bgcolor: "black" }}
        />
        <div className="llm-search-container">
          <div className="input-group">
            <TextField
              multiline
              rows={3}
              defaultValue="Default Value"
              placeholder="Enter general description of recipe, flavors, desired ingredients, or something else..."
              className="search-input wide-textarea"
              value={llmSearch}
              onChange={(e) => setLlmSearch(e.target.value)}
              sx={{ ...textboxStyle, mt: "2rem" }}
            />
          </div>
          <div>
            <Buttons.Button
              variant="contained"
              startIcon={<Icons.Search />}
              onClick={handleLLMSearch}
              sx={{ ...buttonStyle, mb: "4rem" }}
            >
              Search LLM
            </Buttons.Button>
          </div>
          <div className="llm-search-results">
            <h2>--------------LLM Results--------------</h2>
            <LLMResults llmResults={llmSearchResults} />
          </div>
        </div>
      </div>
    </div>
  );
}
