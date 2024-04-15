import { Link } from 'react-router-dom';
import "../styles.css";



export default function Home() {
    return (
        <div className="home">
            <h1>Home</h1>
            <div className="card-container">
                <Link to="/search" className="card-button search">
                    <p>Search</p>
                </Link>
                <Link to="/myrecipes" className="card-button my-recipes">
                    <p>My Recipes</p>
                </Link>
                <Link to="/favorites" className="card-button favorites">
                    <p>Favorites</p>
                </Link>
            </div>
        </div>
    );
}
