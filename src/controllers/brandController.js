// src/controllers/brandController.js
const supabase = require('../supabaseClient')

// Create Brand
async function createBrand (req, res) {
  const { name, description, website } = req.body
  const userId = req.user.userId

  try {
    const { data, error } = await supabase
      .from('brands')
      .insert([{ name, description, website, created_by: userId }])

    if (error) return res.status(400).json({ error: error.message })

    return res
      .status(201)
      .json({ message: 'Brand created successfully', brand: data })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

// Get Brand Details
async function getBrandDetails (req, res) {
  const brandId = req.params.id

  try {
    const { data, error } = await supabase
      .from('brands')
      .select('name, description, website')
      .eq('id', brandId)
      .single()

    if (error || !data)
      return res.status(404).json({ error: 'Brand not found' })

    return res.status(200).json({ brand: data })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

// Update Brand
async function updateBrand (req, res) {
  const brandId = req.params.id
  const { name, description, website } = req.body

  try {
    const { data, error } = await supabase
      .from('brands')
      .update({ name, description, website })
      .eq('id', brandId)
      .select('name, description, website')

    if (error) return res.status(400).json({ error: error.message })
    if (!data.length) return res.status(404).json({ error: 'Brand not found' })

    return res
      .status(200)
      .json({ message: 'Brand updated successfully', brand: data })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

// Delete Brand
async function deleteBrand (req, res) {
  const brandId = req.params.id

  try {
    const { data, error } = await supabase
      .from('brands')
      .delete()
      .eq('id', brandId)
      .select('name')

    if (error) return res.status(400).json({ error: error.message })
    if (!data.length) return res.status(404).json({ error: 'Brand not found' })

    return res.status(200).json({ message: 'Brand deleted successfully' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

// Get All Brands
async function getAllBrands (req, res) {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('name, description, website')

    if (error) return res.status(400).json({ error: error.message })

    return res.status(200).json({ brands: data })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

module.exports = {
  createBrand,
  getBrandDetails,
  updateBrand,
  deleteBrand,
  getAllBrands
}
