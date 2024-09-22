// src/controllers/productController.js
const supabase = require('../supabaseClient');

// Create Product
async function createProduct(req, res) {
    const { name, brand_id, category, is_for_kids, contains_carcinogen, created_by, description } = req.body;
    const userId = req.user.userId;
  
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{ 
          name, 
          brand_id, 
          category, 
          is_for_kids, 
          contains_carcinogen, 
          created_by: userId,
          description 
        }]);
  
      if (error) return res.status(400).json({ error: error.message });
  
      return res.status(201).json({ message: 'Product created successfully' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  

// Get Product Details
async function getProductDetails(req, res) {
    const productId = req.params.id;
  
    try {
      const { data, error } = await supabase
        .from('products')
        .select('name, category, brand_id, is_for_kids, contains_carcinogen, description')
        .eq('id', productId)
        .single();
  
      if (error) {
        console.log('Supabase Error:', error);
        return res.status(400).json({ error: 'Database query failed' });
      }
  
      if (!data) {
        console.log('Product not found for ID:', productId);
        return res.status(404).json({ error: 'Product not found' });
      }
  
      return res.status(200).json({ product: data });
    } catch (err) {
      console.log('Server Error:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }
  

// Update Product
async function updateProduct(req, res) {
  const productId = req.params.id;
  const { name, category, is_for_kids, contains_carcinogen, description } = req.body;

  try {
    const { data, error } = await supabase
      .from('products')
      .update({ name, category, is_for_kids, contains_carcinogen, description })
      .eq('id', productId)
      .select('name, category, brand_id, is_for_kids, contains_carcinogen, description');

    if (error) return res.status(400).json({ error: error.message });
    if (!data || data.length == 0) return res.status(404).json({ error: 'Product not found' });

    return res.status(200).json({ message: 'Product updated successfully', product: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Delete Product
async function deleteProduct(req, res) {
  const productId = req.params.id;

  try {
    const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)
      .select("name");

    if (error) return res.status(400).json({ error: error.message });
    if (!data.length) return res.status(404).json({ error: 'Product not found' });

    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Search Products
async function searchProducts(req, res) {
  const { query } = req.query;

  try {
    const { data, error } = await supabase
      .from('products')
      .select('name, category, brand_id, is_for_kids, contains_carcinogen, description')
      .ilike('name', `%${query}%`);

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({ products: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get Products for Kids
async function getProductsForKids(req, res) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('name, category, brand_id, is_for_kids, contains_carcinogen, description')
      .eq('is_for_kids', true);

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({ products: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get Products with Carcinogens
async function getProductsWithCarcinogens(req, res) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('name, category, brand_id, is_for_kids, contains_carcinogen, description')
      .eq('contains_carcinogen', true);

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({ products: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get All Products
async function getAllProducts(req, res) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({ products: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createProduct,
  getProductDetails,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsForKids,
  getProductsWithCarcinogens,
  getAllProducts,
};
