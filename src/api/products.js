import { supabase } from '../supabaseClient'

export async function getProducts(productType) {
  let query = supabase
    .from('products')
    .select('*')
    .order('expiration', { ascending: true });

  if (productType && productType.trim() !== "") {
      productType = productType.charAt(0).toUpperCase() + productType.slice(1);
      query = query.eq("category", productType);
  }

  return query;
}

export async function createProduct(product) {
  return supabase
    .from('products')
    .insert([product])
}

export async function deleteProduct(id) {
  return supabase
    .from('products')
    .delete()
    .eq('id', id).select();
}

export async function fetchProducts (productType) {
    const { data, error } = await getProducts(productType)
    if (!error) return data
}