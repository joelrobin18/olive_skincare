// src/routes/ingredientRoutes.js
const express = require('express')
const {
  createIngredient,
  getIngredientDetails,
  updateIngredient,
  deleteIngredient,
  searchIngredients,
  getAllIngredients
} = require('../controllers/ingredientController')
const authenticateUser = require('../middlewares/authMiddleware')

const router = express.Router()

router.post('/create', authenticateUser, createIngredient)
router.get('/:id', authenticateUser, getIngredientDetails)
router.put('/:id', authenticateUser, updateIngredient)
router.delete('/:id', authenticateUser, deleteIngredient)
router.get('/all/search', authenticateUser, searchIngredients)
router.get('/', authenticateUser, getAllIngredients)

module.exports = router
