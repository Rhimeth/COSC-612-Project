import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import PropTypes from "prop-types";

import { useNavigate } from "react-router-dom";
import { Circle } from "@mui/icons-material";

function RecipeCard({ recipe: searchResult, detailed = false }) {
  const directions =
    detailed && typeof searchResult.directions === "string"
      ? JSON.parse(searchResult.directions)
      : searchResult.directions;
  const ingredients =
    detailed && typeof searchResult.measurementingredient === "string"
      ? JSON.parse(searchResult.measurementingredient)
      : searchResult.measurementingredient;

  const navigate = useNavigate();
  const handleClick = () => {
    //navigate('/recipeview', { state: { recipe: searchResult } })
    navigate("/recipeview");
    // solution to have recipe be persistent
    localStorage.setItem("currentRecipe", JSON.stringify(searchResult));
  };

  return (
    <Card
      sx={{
        maxWidth: 600,
        minWidth: 300,
        minHeight: 150,
        margin: "auto",
        mt: "1rem",
      }}
      onClick={handleClick}
    >
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {searchResult.title}
        </Typography>
        {detailed && (
          <>
            <Typography variant="body2" color="text.secondary">
              Ingredients:
            </Typography>
            <List dense>
              {ingredients.map((ingredient, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Circle style={{ fontSize: "0.5rem" }} />
                  </ListItemIcon>
                  <ListItemText primary={ingredient} />
                </ListItem>
              ))}
            </List>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Directions:
            </Typography>
            <List dense>
              {directions.map((step, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`${index + 1}. ${step}`} />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </CardContent>
    </Card>
  );
}
RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    recipeid: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    directions: PropTypes.string,
    measurementingredient: PropTypes.string,
    priority: PropTypes.number,
  }).isRequired,
  detailed: PropTypes.bool,
};

export default RecipeCard;
