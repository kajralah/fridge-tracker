import { useEffect, useState } from "react";
import Header from './Header';
import LeftNavigation from './LeftNavigation';
import { useNavigate, useParams, Link } from "react-router-dom";
import { getRecipes, getCategoryId } from './api/recipes';

export default function RecipesByCategory() {
  const { categoryName } = useParams();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRecipes = async () => {
    setLoading(true);

    const { data: category, error: catError } = await getCategoryId(categoryName);

    if (catError || !category) {
      setRecipes([]);
      setLoading(false);
      return;
    }

    const { data, error } = await getRecipes(category.id);

    if (error) {
      console.error("Error fetching recipes:", error);
      setRecipes([]);
    } else {
      setRecipes(data);
    }
      setLoading(false);
  };

  useEffect(() => {
    fetchRecipes();
  }, [categoryName]);
  
  if (loading) return <p>Loading recipes...</p>;
  if (recipes.length === 0) 
    return <div>
      <Link to="/recipes" style={{marginLeft: '20px'}}>← Back to recipes</Link>
      <p>No recipes found.</p>
    </div>

  return (
    <div className="full-height">
        <Header />
        <hr/>
        <div style={{display: 'flex', flexDirection: 'row'}} className="full-height">
            <LeftNavigation />
            <ul style={{ listStyle: "none", padding: 0, maxWidth: 600 }}>
                {recipes.map((recipe) => (
                    <li key={recipe.id} style={{ marginBottom: "10px", borderBottom: "1px solid #ccc" }}>
                    <div
                        onClick={() => navigate(`/recipes/${recipe.id}`)}
                        style={{
                        cursor: "pointer",
                        padding: "10px",
                        backgroundColor: "#fff",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center"
                        }}
                    >
                        {recipe.image_url && (
                            <img
                                src={recipe.image_url}
                                alt={recipe.name}
                                style={{
                                width: 50,
                                height: 50,
                                objectFit: "cover",
                                borderRadius: 6,
                                marginRight: 10,
                                }}
                            />
                        )}
                        <h2>{recipe.name}</h2>
                    </div>
                    </li>
                ))}
            </ul>
        </div>
    </div>
  );
}