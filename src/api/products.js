import { supabase } from '../supabaseClient'

export async function getProducts(productType) {
  let query = supabase
    .from('products')
    .select('*')
    .order('expiration', { ascending: true });

  if (productType && productType.trim() !== "" && productType !== 'Fridge-tracker') {
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

export async function editProduct(product) {
  return supabase 
    .from('products')
      .update({
        name: product.name,
        qty: product.qty,
        category: product.category,
        expiration: product.expiration
      })
      .eq("id", product.id);
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