import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Header from './Header';
import LeftNavigation from './LeftNavigation';
import CreateRecipeDialog from "./CreateRecipeDialog";
import { useNavigate } from "react-router-dom";
import { getRecipes } from './api/recipes';
import './css/RecipesList.css';

export default function RecipesList() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const fetchRecipes = async () => {
    setLoading(true);
    const { data, error } = await getRecipes();

    if (error) {
      console.error("Error fetching recipes:", error);
    }

    setRecipes(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  if (loading) return <p>Loading recipes...</p>;
  if (recipes.length === 0) return <p>No recipes found.</p>;

  return (
    <div className="full-height">
        <Header />
        <hr/>
        <div className="recipesListContainer full-height">
            <LeftNavigation />
            <div className="recipesContainer">
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                    <button className="createButton" onClick={() => setOpenDialog(true)}>+ Create Recipe</button>
                </div>
                <CreateRecipeDialog
                    isOpen={openDialog}
                    onClose={() => setOpenDialog(false)}
                    onRecipeCreated={(newRecipe) => {
                    console.log("New recipe created:", newRecipe);
                    }}
                />
                <ul className="recipes-grid">
                    {recipes.map((recipe) => (
                        <li key={recipe.id} className="recipe-card" onClick={() => navigate(`/recipes/${recipe.id}`)}>
                            {recipe.image_url && (
                                <img
                                    src={recipe.image_url}
                                    alt={recipe.name}
                                    style={{
                                    width: 50,
                                    height: 50,
                                    objectFit: "cover"
                                    }}
                                />
                            )}
                            <h2>{recipe.name}</h2>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
  );
}
