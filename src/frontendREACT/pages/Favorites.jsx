import RecipeCard from "../components/RecipeCard";

import { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

function Favorites() {
  const [allFavorites, setAllFavorites] = useState([]);

  useEffect(() => {
    fetchAllFavorites(1); // TODO AppuserID is hard coded
  }, []);

  const fetchAllFavorites = async (appUserId) => {
    try {
      const response = await fetch(
        `/api/database/getallfavorites?appUserId=${appUserId}`
      );
      if (!response.ok) throw new Error("Failed to retrieve favorites");

      const favoritesData = await response.json();
      console.log("Fetched Favorites Data:", favoritesData);
      setAllFavorites(
        favoritesData.map((favorite) => ({ ...favorite, isFavorited: true }))
      );
    } catch (error) {
      console.error("Error retrieving all favorites:", error);
    }
  };

  const toggleFavorite = async (recipeId, index) => {
    console.log("Toggling favorite for recipe ID:", recipeId);
    try {
      const response = await fetch("/api/database/removefavorite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipeId: recipeId, appUserId: 1 }),
      });
      if (!response.ok) throw new Error("Failed to remove favorite");

      const updatedFavorites = [...allFavorites];
      updatedFavorites.splice(index, 1);
      // We will just set it here so on page reload it will display correct favorites
      setAllFavorites(updatedFavorites);
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "2rem",
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        style={{ width: "100%" }}
      >
        Favorites
      </Typography>
      {allFavorites.map((recipe, index) => (
        <Box
          key={recipe.recipeId}
          sx={{ marginBottom: 4, width: "100%", maxWidth: "600px" }}
        >
          <RecipeCard recipe={recipe} detailed={true} />
          <IconButton
            onClick={() => toggleFavorite(recipe.recipeid, index)}
            color="error"
            sx={{ fontSize: "6rem", marginTop: 2 }}
          >
            {recipe.isFavorited ? (
              <FavoriteIcon fontSize="inherit" />
            ) : (
              <FavoriteBorderIcon fontSize="inherit" />
            )}
          </IconButton>
        </Box>
      ))}
    </Box>
  );
}

export default Favorites;
