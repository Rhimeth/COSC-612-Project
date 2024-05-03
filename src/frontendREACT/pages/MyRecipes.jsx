import { Typography, Box } from "@mui/material";

export default function myRecipes() {
  return (
    <Box className="myrecipes" sx={{ flexGrow: 1, padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Recipes
      </Typography>
    </Box>
  );
}
