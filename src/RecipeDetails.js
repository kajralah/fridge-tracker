import Header from './Header';
import LeftNavigation from './LeftNavigation';
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "./supabaseClient";

export default function RecipeDetails() {

  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
 
useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("recipes")
      .select(`
        id,
        name,
        instructions,
        cook_time,
        image_url,
        recipe_ingredients (
          quantity,
          unit,
          ingredients ( name )
        )
      `)
      .eq("id", id)
      .single();

    if (!error) setRecipe(data);
    setLoading(false);
  };

  if (loading) return <p>Loading...</p>;
  if (!recipe) return <p>Recipe not found</p>;

  return (
    <div className="full-height">
        <Header />
        <hr/>
        <div style={{display: 'flex', flexDirection: 'row'}} className="full-height">
            <LeftNavigation />
            <div>
                <Link to="/recipes">← Back to recipes</Link>

                <div style={{ padding: "10px 15px" }}>
                    {recipe.image_url && (
                        <img
                        src={recipe.image_url}
                        alt={recipe.name}
                        style={{ width: "200px", height: "150px", objectFit: "cover", borderRadius: 8, marginBottom: 10 }}
                        />
                    )}
                    <p><strong>Description:</strong> {recipe.description || "No description"}</p>
                    <p><strong>Cook Time:</strong> {recipe.cook_time || "N/A"} mins</p>
                    <p><strong>Servings:</strong> {recipe.servings || "N/A"}</p>
                    <p><strong>Instructions:</strong> {recipe.instructions}</p>

                    {recipe.recipe_ingredients?.length > 0 && (
                        <>
                        <strong>Ingredients:</strong>
                        <ul>
                            {recipe.recipe_ingredients.map((ri, idx) => (
                            <li key={idx}>
                                {ri.quantity} {ri.unit} {ri.ingredients.name}
                            </li>
                            ))}
                        </ul>
                        </>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}
