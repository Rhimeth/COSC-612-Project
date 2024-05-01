import { useLocation } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";

import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

function RecipeView() {
  const location = useLocation();
  const recipe = location.state ? location.state.recipe : null;
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    checkFavoriteStatus();
  }, []);

  if (!recipe) {
    return (
      <div>
        <h1>Click on a recipe from search, favorites, or my recipes.</h1>
      </div>
    );
  }

  // May not implement, have to check if favorited already to fill in
  const checkFavoriteStatus = async () => {
  };

  const toggleFavorite = async () => {
    setIsFavorited(!isFavorited);
    const url = isFavorited
      ? "/api/database/removeFavorite"
      : "/api/database/addFavorite";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipeId: recipe.recipeid, appUserId: 1 }),
      });
      if (!response.ok) throw new Error("error");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const exploreSimilar = async () => {
    try {
      const response = await fetch("/api/database/exploresimilar", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: recipe.title,
          ingredients: recipe.ingredients,
        }),
      });
      if (!response.ok) throw new Error("error");
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
      <RecipeCard recipe={recipe} detailed={true} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          paddingRight: "1rem",
          paddingTop: "1rem",
        }}
      >
        <IconButton
          onClick={toggleFavorite}
          color="error"
          sx={{ mb: 2, fontSize: "6rem" }}
        >
          {isFavorited ? (
            <FavoriteIcon fontSize="inherit" />
          ) : (
            <FavoriteBorderIcon fontSize="inherit" />
          )}
        </IconButton>
        <Button
          variant="contained"
          onClick={exploreSimilar}
          sx={{ width: "fit-content" }}
        >
          Explore Similar
        </Button>
      </Box>
    </Box>
  );
}

export default RecipeView;
