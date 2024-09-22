// src/controllers/ingredientController.js
const supabase = require('../supabaseClient');

// Create Ingredient
async function createIngredient(req, res) {
  const { name, is_allergen,is_carcinogen , not_suitable_for_babies, description } = req.body;
  const userId = req.user.userId;

  try {
    const { data, error } = await supabase
      .from('ingredients')
      .insert([{ name, is_allergen,is_carcinogen , not_suitable_for_babies, description, created_by: userId }]);

    if (error) return res.status(400).json({ error: error.message });

    return res.status(201).json({ message: 'Ingredient created successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get Ingredient Details
async function getIngredientDetails(req, res) {
  const ingredientId = req.params.id;

  try {
    const { data, error } = await supabase
      .from('ingredients')
      .select('name, is_allergen,is_carcinogen , not_suitable_for_babies, description')
      .eq('id', ingredientId)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Ingredient not found' });

    return res.status(200).json({ ingredient: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Update Ingredient
async function updateIngredient(req, res) {
  const ingredientId = req.params.id;
  const { name, is_allergen,is_carcinogen , not_suitable_for_babies, description } = req.body;

  try {
    const { data, error } = await supabase
      .from('ingredients')
      .update({ name, is_allergen,is_carcinogen , not_suitable_for_babies, description })
      .eq('id', ingredientId)      
      .select('name, is_allergen,is_carcinogen , not_suitable_for_babies, description');

    if (error) return res.status(400).json({ error: error.message });
    if (!data.length) return res.status(404).json({ error: 'Ingredient not found' });

    return res.status(200).json({ message: 'Ingredient updated successfully', ingredient: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Delete Ingredient
async function deleteIngredient(req, res) {
  const ingredientId = req.params.id;

  try {
    const { data, error } = await supabase
      .from('ingredients')
      .delete()
      .eq('id', ingredientId)
      .select("name");

    if (error) return res.status(400).json({ error: error.message });
    if (!data.length) return res.status(404).json({ error: 'Ingredient not found' });

    return res.status(200).json({ message: 'Ingredient deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Search Ingredients
async function searchIngredients(req, res) {
  const { query } = req.query;

  try {
    const { data, error } = await supabase
      .from('ingredients')
      .select('name, is_allergen,is_carcinogen , not_suitable_for_babies, description')
      .ilike('name', `%${query}%`);

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({ ingredients: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Get All Ingredients
async function getAllIngredients(req, res) {
  try {
    const { data, error } = await supabase
      .from('ingredients')
      .select('name, is_allergen,is_carcinogen , not_suitable_for_babies, description');

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({ ingredients: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createIngredient,
  getIngredientDetails,
  updateIngredient,
  deleteIngredient,
  searchIngredients,
  getAllIngredients,
};
