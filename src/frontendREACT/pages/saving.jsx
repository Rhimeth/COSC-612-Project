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
          <Buttons.Button
            variant="contained"
            startIcon={<Icons.Search />}
            onClick={handleTitleSearch}
            sx={buttonStyle}
          >
            Search Title
          </Buttons.Button>
        </div>
        <p className="search-paragraph">OR</p>
        <div className="input-group">
          <TextField
            multiline
            rows={3}
            defaultValue="Default Value"
            placeholder="Enter general description of recipe, flavors, desired ingredients, or something else..."
            className="search-input wide-textarea"
            value={llmSearch}
            onChange={(e) => setLlmSearch(e.target.value)}
            sx={textboxStyle}
          />

          <Buttons.Button
            variant="contained"
            startIcon={<Icons.Search />}
            onClick={handleLLMSearch}
            sx={buttonStyle}
          >
            Search LLM
          </Buttons.Button>
        </div>
      </div>
      <div className="results-section">
        <div className="title-search-results">
          <p>Title Results</p>
          {titleSearchResults.map((searchResult) => (
            <div key={searchResult.recipeid} className="card-button">
              <h3>{searchResult.title}</h3>
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