import { Link as RouterLink } from 'react-router-dom'
import { Typography, Box, Card, CardActionArea, CardContent, Grow } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'  // Import for Search
import FavoriteIcon from '@mui/icons-material/Favorite'  // Import for Favorites
import RecipeIcon from '@mui/icons-material/Book'  // Import for My Recipes

export default function home() {
    return (
        <Box className="home" sx={{ flexGrow: 1, padding: 3, alignItems: 'center', flexDirection: 'column' }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Home
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Grow in={true} style={{ transformOrigin: '0 0 0' }} timeout={500}>
                    <Card sx={{ width: 200, height: 300, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <CardActionArea component={RouterLink} to="/search">
                            <CardContent>
                                <SearchIcon sx={{ fontSize: 40 }} />
                                <Typography variant="h6" component="div">
                                    Search
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grow>
                <Grow in={true} style={{ transformOrigin: '0 0 0' }} timeout={700}>
                    <Card sx={{ width: 200, height: 300, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <CardActionArea component={RouterLink} to="/myrecipes">
                            <CardContent>
                                <RecipeIcon sx={{ fontSize: 40 }} />
                                <Typography variant="h6" component="div">
                                    My Recipes
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grow>
                <Grow in={true} style={{ transformOrigin: '0 0 0' }} timeout={900}>
                    <Card sx={{ width: 200, height: 300, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <CardActionArea component={RouterLink} to="/favorites">
                            <CardContent>
                                <FavoriteIcon sx={{ fontSize: 40 }} />
                                <Typography variant="h6" component="div">
                                    Favorites
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grow>
            </Box>
        </Box>
    )
}
