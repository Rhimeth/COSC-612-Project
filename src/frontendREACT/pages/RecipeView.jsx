import RecipeCard from "../components/RecipeCard";

import { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import Tag from "../components/Tag";
import useLocalStorageListener from './PageReloadHook';

function RecipeView() {
  
  const [isFavorited, setIsFavorited] = useState(false);
  const [tags, setTags] = useState([]);
  const [similarRecipes, setSimilarRecipes] = useState([]);

  const loadedRecipe = useLocalStorageListener('currentRecipe');

  useEffect(() => {
    // Load the recipe from localStorage
    const recipeData = localStorage.getItem("currentRecipe");
    if (recipeData) {
      const parsedRecipe = JSON.parse(recipeData);

      fetchTags(parsedRecipe.recipeid);
      checkFavoriteStatus(parsedRecipe.recipeid);
    }
  }, [loadedRecipe]);

  

  const fetchTags = async (recipeId) => {
    try {
      console.log("at try block of fetchTags()");
      const response = await fetch(
        `/api/database/tagssearch?recipeId=${recipeId}`
      );
      console.log("got back a response");
      const fetchedTags = await response.json();
      console.log("going to setTags()");
      setTags(
        fetchedTags.map((tag) => ({ ...tag, tagId: parseInt(tag.tagId) }))
      );
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  // Search with Explore Similar
  // const [exploreSimilarSearch, setexploreSimilarSearch] = useState("");
  // const [exploreSimilarSearchResults, setexploreSimilarSearchResults] = useState("");

  // useEffect(() => {
  //   //checkFavoriteStatus();
  // }, []);

  const checkFavoriteStatus = async (recipeId) => {
    try {
      const response = await fetch(
        `/api/database/checkfavorite?recipeId=${recipeId}&appUserId=1`
      );
      if (!response.ok) throw new Error("Failed to check favorite status");

      const data = await response.json();
      setIsFavorited(data.isFavorited); // Assume the backend sends back { isFavorited: true/false }
    } catch (error) {
      console.error("Error checking favorite status:", error);
    }
  };

  const toggleFavorite = async () => {
    const favoritedStatus = !isFavorited;
    setIsFavorited(favoritedStatus);
    const url = favoritedStatus
      ? "/api/database/addfavorite"
      : "/api/database/removefavorite";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipeId: loadedRecipe.recipeid, appUserId: 1 }),
      });
      if (!response.ok) throw new Error("Failed to toggle favorite status");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleExploreSimilar = async () => {
    console.log("Entering handleExploreSimilar");
  
    try {

      console.log("Loaded recipe: ", loadedRecipe.recipeid)
      const recipeid = encodeURIComponent(loadedRecipe.recipeid);
      const url = `/api/database/exploresimilar?recipeid=${recipeid}`;
  
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      if (!response.headers.get("content-type")?.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Expected JSON, got ${text.slice(0, 100)}`); // Shows first 100 chars of the response
      }
  
      const similarRecipes = await response.json();
      console.log("Fetched similar recipes:", similarRecipes);
  
      setSimilarRecipes(similarRecipes); // Update the state with fetched recipes
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  if (!loadedRecipe) {
    return (
      <div>
        <h1>Click on a recipe from search, favorites, or my recipes.</h1>
      </div>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
      }}
    >
      <Box className="myrecipes" sx={{ flexGrow: 1, padding: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Recipe View
        </Typography>
      </Box>
      <RecipeCard recipe={loadedRecipe} detailed={true} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          paddingTop: "1rem",
        }}
      >
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", marginY: 2 }}>
          {tags.map((tag) => (
            <Tag key={tag.tagId} tag={tag} />
          ))}
        </Box>
        <IconButton
          onClick={toggleFavorite}
          color="error"
          sx={{ mb: 2, fontSize: "6rem", ml: "auto", mr: "auto" }}
        >
          {isFavorited ? (
            <FavoriteIcon fontSize="inherit" />
          ) : (
            <FavoriteBorderIcon fontSize="inherit" />
          )}
        </IconButton>
        <Button
          variant="contained"
          onClick={handleExploreSimilar}
          sx={{ ml: "auto", mr: "auto" }}
        >
          Explore Similar
        </Button>
        {similarRecipes.length > 0 && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              marginTop: 2,
            }}
          >
            {similarRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} detailed={false} />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default RecipeView;
