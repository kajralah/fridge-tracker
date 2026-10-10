import { useEffect, useState } from "react";
import Header from "./Header";
import LeftNavigation from "./LeftNavigation";
import CreateRecipeDialog from "./CreateRecipeDialog";
import { useNavigate } from "react-router-dom";
import { getRecipes } from "./api/recipes";
import cookTimeIcon from "./cook_time.png";
import "./css/RecipesList.css";

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

  if (loading) {
    return <p>Loading recipes...</p>;
  }

  if (recipes.length === 0) {
    return (
      <div className="recipesContainer">
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "1rem",
          }}
        >
          <button
            className="createButton"
            onClick={() => setOpenDialog(true)}
          >
            + Create Recipe
          </button>
        </div>

        <CreateRecipeDialog
          isOpen={openDialog}
          onClose={() => setOpenDialog(false)}
        />

        <p>No recipes found.</p>
      </div>
    );
  }

  return (
    <div className="full-height wrapper">
      <Header />
      <hr />

      <div className="recipesListContainer full-height">
        <LeftNavigation />

        <div className="recipesContainer">
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "1rem",
            }}
          >
            <button
              className="createButton"
              onClick={() => setOpenDialog(true)}
            >
              + Create Recipe
            </button>
          </div>

          <CreateRecipeDialog
            isOpen={openDialog}
            onClose={() => setOpenDialog(false)}
          />

          <ul className="recipes-grid">
            {recipes.map((recipe) => {
              const cookTime = Number(recipe.cook_time);

              const formattedCookTime =
                recipe.cook_time != null &&
                recipe.cook_time !== "" &&
                Number.isFinite(cookTime) &&
                cookTime >= 0
                  ? cookTime > 0
                    ? `${Math.floor(cookTime / 60) > 0
                        ? `${Math.floor(cookTime / 60)}h `
                        : ""}${cookTime % 60 > 0
                        ? `${cookTime % 60} min`
                        : cookTime >= 60
                          ? ""
                          : `${cookTime} min`}`.trim()
                    : "0 min"
                  : "N/A";

              return (
                <li
                  key={recipe.id}
                  className="recipe-card"
                  onClick={() =>
                    navigate(`/recipes/${recipe.id}`)
                  }
                >
                  {recipe.image_url && (
                    <img
                      src={recipe.image_url}
                      alt={recipe.name}
                      className="recipe-card-image"
                    />
                  )}

                  <h2>{recipe.name}</h2>

                  <p className="recipe-cook-time">
                    <img
                      src={cookTimeIcon}
                      alt=""
                      className="icon"
                    />
                    <span>{formattedCookTime}</span>
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}