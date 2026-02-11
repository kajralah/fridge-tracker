import { supabase } from '../supabaseClient'

export async function getRecipes(categoryId, recipeId) {
     let query = supabase.from("recipes")
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
    `);

    if (categoryId && categoryId.trim() !== "") {
      query = query.eq("category_id", categoryId);
    }

    if (recipeId && recipeId.trim() !== "") {
      query = query.eq("id", recipeId);
    }

    return query;
}