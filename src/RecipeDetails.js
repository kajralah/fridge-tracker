import Header from './Header';
import LeftNavigation from './LeftNavigation';
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getRecipes } from './api/recipes';
import cookTimeIcon from "./img/cook_time.png";
import './css/RecipeDetails.css';

export default function RecipeDetails() {

    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checked, setChecked] = useState({});

    useEffect(() => {
        fetchRecipe();
    }, [id]);

    const fetchRecipe = async () => {
        setLoading(true);

        const { data, error } = await getRecipes(null, id);

        if (!error) setRecipe(data);
        setLoading(false);
    };

    if (loading) return <p>Loading...</p>;
    if (!recipe) return <p>Recipe not found</p>;

    const toggle = (index) => {
        setChecked((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    return (
        <div className="full-height">
            <Header />
            <hr/>
            <div style={{display: 'flex', flexDirection: 'row'}} className="full-height">
                <LeftNavigation />
                <div>
                    <Link to="/recipes" style={{marginLeft: '20px'}}>← Back to recipes</Link>

                    <div style={{ padding: "10px 15px" }}>
                        <div style={{ display: "flex", gap: "30px", alignItems: "center"}}>
                            {recipe.image_url && (
                                <img
                                src={recipe.image_url}
                                alt={recipe.name}
                                style={{ width: "350px", height: "350px", objectFit: "cover", borderRadius: 8, marginBottom: 10 }}
                                />
                            )}
                            <div>
                                {recipe.recipe_ingredients?.length > 0 && (
                                    <div className="ingredients-list">
                                        <strong>Ingredients:</strong>
                                        <ul>
                                            {recipe.recipe_ingredients.map((ri, idx) => (
                                                <li key={idx} className={checked[idx] ? "checked" : ""}>
                                                    <label>
                                                        <input
                                                        type="checkbox"
                                                        checked={!!checked[idx]}
                                                        onChange={() => toggle(idx)}
                                                        />
                                                        <span>{ri.quantity} {ri.unit} {ri.ingredients.name}</span>
                                                    </label>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <div style={{height: '100%'}}>
                                <p style={{display: 'flex'}}><img src={cookTimeIcon} class="icon"/> {recipe.cook_time || "N/A"} mins</p>
                                {recipe.servings ? <p><strong>Servings:</strong> {recipe.serving}</p> : ""}
                            </div>
                        </div>
                        <p><strong>Instructions:</strong> {recipe.instructions}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}