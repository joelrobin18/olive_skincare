// src/routes/productRoutes.js
const express = require('express')
const {
  createProduct,
  getProductDetails,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsForKids,
  getProductsWithCarcinogens,
  getAllProducts
} = require('../controllers/productController')
const authenticateUser = require('../middlewares/authMiddleware')

const router = express.Router()

router.post('/create', authenticateUser, createProduct)
router.get('/all/search', authenticateUser, searchProducts)
router.get('/search/kids', authenticateUser, getProductsForKids)
router.get('/search/carcinogens', authenticateUser, getProductsWithCarcinogens)
router.get('/:id', authenticateUser, getProductDetails)
router.put('/:id', authenticateUser, updateProduct)
router.delete('/:id', authenticateUser, deleteProduct)
router.get('/', authenticateUser, getAllProducts)

module.exports = router
