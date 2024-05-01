import { useState } from "react";
import * as Buttons from "@mui/material";
import * as Icons from "@mui/icons-material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Divider from '@mui/material/Divider';

import "../styles.css";

const buttonStyle = {
  backgroundColor: "green",
  color: "white",
  padding: "8px 16px", // Vertical and horizontal padding (commonly used for button padding)
  margin: "10px", // Margin around the button to ensure it doesn't touch other elements
  borderRadius: "4px", // Rounded corners, a common design choice for modern buttons
  textTransform: "none", // By default, MUI buttons are uppercase; setting to 'none' keeps text as is
  fontWeight: "bold", // Makes the button text bold, which is common for readability
  "&:hover": {
    backgroundColor: "darkgreen", // Slightly darker green on hover for a subtle interaction effect
  },
  "&:active": {
    backgroundColor: "#005700", // Even darker green when the button is clicked
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)", // Optional: Inner shadow to simulate a pressed button
  },
  "&:disabled": {
    backgroundColor: "#cccccc", // Greyed out background for disabled state
    color: "#666666", // Greyed out text color for disabled state
  },
};

const textboxStyle = {
  width: "20rem",
  backgroundColor: "white",
};

function CustomDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Box
        sx={{
          height: "100%", // Adjust based on your layout needs
          width: "20px", // Thickness of the line
          backgroundColor: "grey", // Color of the line
          margin: "0 20px", // Spacing around the line
        }}
      />
    </div>
  );
}

export default function Search() {
  // Searching by title
  const [titleSearch, setTitleSearch] = useState("");
  const [titleSearchResults, setTitleSearchResults] = useState([]);

  // Search with LLM
  const [llmSearch, setLlmSearch] = useState("");
  const [llmResults, setLlmResults] = useState([]);

  // Title Search
  const handleTitleSearch = async () => {
    console.log("Entering handleTitleSearch");
    if (!titleSearch) {
      alert("Search can't be empty");
      return;
    }

    try {
      console.log("Searching for: ", titleSearch);
      const response = await fetch(
        `/api/database/titlesearch?q=${encodeURIComponent(titleSearch)}`
      );
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
      setTitleSearchResults([]); // had to clear results if it errors
    }
  };

  // LLM Search
  const handleLLMSearch = async () => {
    if (llmSearch.trim().length <= 10) {
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
      <div className="search-container">
        <div className="title-search-container">
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter title here..."
              className="search-input wide-input"
              value={titleSearch}
              onChange={(e) => setTitleSearch(e.target.value)}
            />
          </div>
          <div>
            <Buttons.Button
              variant="contained"
              startIcon={<Icons.Search />}
              onClick={handleTitleSearch}
              sx={buttonStyle}
            >
              Search Title
            </Buttons.Button>
          </div>
          <div className="title-search-results">
            <p>Title Results</p>
            {titleSearchResults.map((searchResult) => (
              <div key={searchResult.recipeid} className="card-button">
                <h3>{searchResult.title}</h3>
              </div>
            ))}
          </div>
        </div>
        <Divider orientation="vertical" flexItem />
        <div className="llm-search-container" style={{ flex: 1 }}>
          <div className="input-group">
            <textarea
              placeholder="Enter general description of recipe, flavors, desired ingredients, or something else..."
              className="search-input wide-textarea"
              value={llmSearch}
              onChange={(e) => setLlmSearch(e.target.value)}
            />
          </div>
          <div>
            <Buttons.Button
              variant="contained"
              startIcon={<Icons.Search />}
              onClick={handleLLMSearch}
              sx={buttonStyle}
            >
              Search LLM
            </Buttons.Button>
          </div>
          <div className="llm-search-results">
            <p>LLM Results</p>
            {llmResults.map((result, index) => (
              <div key={index} className="text-response">
                <h3>{result.response}</h3>
                <p>{result.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
// TODO change result.response to w/e openai calls it
