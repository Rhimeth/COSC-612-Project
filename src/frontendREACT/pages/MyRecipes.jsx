import { Typography, Box } from "@mui/material";
import RecipeCard from "../components/RecipeCard";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ArrowUpward from "@mui/icons-material/ArrowUpward";

function RecipeInputForm() {
  const [title, setTitle] = useState("");
  const [measurementIngredient, setMeasurementIngredient] = useState("");
  const [directions, setDirections] = useState("");
  const [myRecipes, setMyRecipes] = useState([]);

  useEffect(() => {
    fetchMyRecipes(1); // appuserid hard-coded to 1
  }, []);

  const handleRecipeUpload = async () => {
    console.log("Entering handleRecipeUpload");

    try {
      console.log("at frontend try of upload");

      const encodedTitle = encodeURIComponent(title);
      const encodedMeasurementIngredient = encodeURIComponent(
        measurementIngredient
      );
      const encodedDirections = encodeURIComponent(directions);

      const url = `/api/database/recipeupload?title=${encodedTitle}&measurementingredient=${encodedMeasurementIngredient}&directions=${encodedDirections}`;

      const response = await fetch(url);
      let data = await response.json();
      console.log("Data received:", data);
      let displayData = await response.json();
      console.log("Data received:", displayData);
      setMyRecipes((prevRecipes) => [...prevRecipes, data]);
    } catch (error) {
      console.error("Unable to fetch data due to", error);
    }
  };

  const fetchMyRecipes = async (appUserId) => {
    try {
      console.log("at frontend try of fetchMyRecipes()");
      const response = await fetch(
        `/api/database/fetchmyrecipes?appUserId=${appUserId}`
      );
      if (!response.ok) throw new Error("Failed to retrieve recipes");

      const data = await response.json();
      console.log("data:" , data);
      setMyRecipes(
        data.map((recipe) => ({
          ...recipe,
          directions: JSON.parse(recipe.directions),
          measurementingredient: JSON.parse(recipe.measurementingredient),
        }))
      );
      console.log("set my recipes");
    } catch (error) {
      console.error("Error retrieving recipes:", error);
    }
  };

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
    width: "25rem",
    backgroundColor: "white",
    mt: "1rem",
    mb: "1rem",
  };

  return (
    <Box>
      <Box sx={{ flexGrow: 1, padding: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Recipes
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <Typography component="h1" gutterBottom>
          Upload a Recipe
        </Typography>
        <TextField
          required
          id="outlined-required"
          label="Recipe Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          variant="outlined"
          sx={textboxStyle}
        />

        <TextField
          required
          id="measurements-ingredients"
          label="Measurement and Ingredients"
          multiline
          rows={4}
          value={measurementIngredient}
          onChange={(e) => setMeasurementIngredient(e.target.value)}
          variant="outlined"
          sx={textboxStyle}
        />

        <TextField
          required
          id="directions"
          label="Directions"
          multiline
          rows={4}
          value={directions}
          onChange={(e) => setDirections(e.target.value)}
          variant="outlined"
          sx={textboxStyle}
        />

        <Button
          variant="contained"
          startIcon={<ArrowUpward />}
          onClick={handleRecipeUpload}
          sx={buttonStyle}
        >
          Upload Recipe
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "2rem",
          mt: "2rem",
        }}
      >
        {myRecipes.map((recipe) => (
          <RecipeCard key={recipe.recipeid} recipe={recipe} detailed={true} />
        ))}
      </Box>
    </Box>
  );
}

export default RecipeInputForm;
