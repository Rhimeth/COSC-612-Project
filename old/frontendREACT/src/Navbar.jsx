import { Link, useMatch, useResolvedPath } from "react-router-dom";
// Link allows us to replace anchor tags so that we don't get a page
// reload upon navigation **instead of href, you use "to"**

/* eslint-disable react/prop-types */

export default function Navbar() {
  return (
    <nav className="nav">
      <Link to="/home" className="site-title">
        Flavor Formulas
      </Link>
      <ul>
        <CustomLink to="/home">Home</CustomLink>
        <CustomLink to="/myrecipes">My Recipes</CustomLink>
        <CustomLink to="/favorites">Favorites</CustomLink>
        <CustomLink to="/search">Search</CustomLink>
        <CustomLink to="/profile">Profile</CustomLink>
      </ul>
    </nav>
  );
}

// Routing
// This routing is working because when the user clicks a 
// link -> updates URL -> <Routes> listens for URL changes ->
// renders the relavant components. So this isn't explicitly
// programmed, but is "passed through" the browser changing
// the URL


// CSS based on browser matches the URL from the CustomLink "to" input
// Also handles the Link it'self with is oun the Routing in App.jsx
function CustomLink({ to, children, ...props }) {
  // Using React router requires resolving path
  // resolvedPath is the same as absolute path
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true }); // end:true means no partial matchning

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}
