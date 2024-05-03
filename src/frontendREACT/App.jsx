import Home from "./pages/Home"
import Navbar from "./Navbar"
import Favorites from "./pages/Favorites"
import MyRecipes from "./pages/MyRecipes"
import RecipeView from "./pages/RecipeView"
import Search from "./pages/Search"
import { Route, Routes } from "react-router-dom"

function App() {
  return (
    <>
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/myrecipes" element={<MyRecipes />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/search" element={<Search />} />
            <Route path="/recipeview" element={<RecipeView />} />
          </Routes>
        </div>
    </>
  )
}

export default App
