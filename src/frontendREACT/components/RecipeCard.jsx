import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import PropTypes from 'prop-types';

import { useNavigate } from 'react-router-dom';

function RecipeCard({ recipe, detailed = false }) {
  const directions = detailed && typeof recipe.directions === 'string' ? JSON.parse(recipe.directions) : recipe.directions;
  const ingredients = detailed && typeof recipe.measurementingredient === 'string' ? JSON.parse(recipe.measurementingredient) : recipe.measurementingredient;


  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/recipeview', { state: { recipe } }); 
  };
  return (
    <Card sx={{ maxWidth: 700, minWidth:300, minHeight: 150, margin: 'auto', mt: '1rem' }} onClick={handleClick}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {recipe.title}
        </Typography>
        {detailed && (
          <>
            <Typography variant="body2" color="text.secondary">
              Ingredients:
            </Typography>
            <List dense>
              {ingredients.map((ingredient, index) => (
                <ListItem key={index}>
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
                  <ListItemText primary={step} />
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
    priority: PropTypes.number
  }).isRequired,
  detailed: PropTypes.bool
};

export default RecipeCard;
