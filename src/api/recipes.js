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
      query = query.single();
    }

    return query;
}

export async function getCategoryId(categoryName) {
     return supabase
      .from("categories")
      .select("id")
      .eq("name", categoryName)
      .single();
}

export async function fetchCategories() {
    return supabase.from("categories").select("id, name").order("name");
}

export async function insertRecipe(form, imageUrl) {
  return supabase.from("recipes").insert({
    name: form.name,
    category_id: form.category_id,
    cook_time: form.cook_time,
    instructions: form.instructions,
    image_url: imageUrl,
  }).select().single();
}

export async function uploadImage(fileName, formImg) {
  return supabase.storage
    .from("recipe-images")
    .upload(fileName, formImg);
}

export async function getImagePublicUrl(fileName) {
  return supabase.storage
    .from("recipe-images")
    .getPublicUrl(fileName);
}