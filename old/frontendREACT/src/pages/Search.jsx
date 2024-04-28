import { useState } from "react";
import "../styles.css";

export default function Search() {
  // Searching by title
  const [titleSearch, setTitleSearch] = useState("");
  const [titleSearchResults, setTitleSearchResults] = useState([]);

  // Search with LLM
  const [llmSearch, setLlmSearch] = useState("");
  const [llmResults, setLlmResults] = useState([]);

  // Title Search
  const handleTitleSearch = async () => {
    if (!titleSearch) {
      alert("Search can't be empty");
      return;
    }

    try {
      alert("At the try block for frontend title search")
      const response = await fetch(
        `/api/database/titlesearch?q=${encodeURIComponent(titleSearch)}`
      );
      const data = await response.json();
      setTitleSearchResults(data);
    } catch (error) {
      console.error("Unable to fetch data due to", error);
      setTitleSearchResults([]); // had to clear results if it errors
    }
  };

  // LLM Search
  const handleLlmSearch = async () => {
    if (llmSearch.trim().length <= 10) {
      alert("LLM search must be more than 10 characters");
      return;
    } else {
      try {
        alert('at the try block for front end llm search')
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
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter title here..."
            className="search-input wide-input"
            value={titleSearch}
            onChange={(e) => setTitleSearch(e.target.value)}
          />
          <button onClick={handleTitleSearch} className="search-button">
            Search Title
          </button>
        </div>
        <p className="search-paragraph">OR</p>
        <div className="input-group">
          <textarea
            placeholder="Enter general description of recipe, flavors, desired ingredients, or something else..."
            className="search-input wide-textarea"
            value={llmSearch}
            onChange={(e) => setLlmSearch(e.target.value)}
          />
          <button onClick={handleLlmSearch} className="search-button">
            Search LLM
          </button>
        </div>
      </div>
      <div className="results-section">
        <div className="title-search-results">
          <p>Title Results</p>
          {titleSearchResults.map((searchResult) => (
            <div key={searchResult.id} className="card-button">
              <h3>{searchResult.title}</h3>
              <p>{searchResult.description}</p>
            </div>
          ))}
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
  );
}
// TODO change result.response to w/e openai calls it
