// src/routes/brandRoutes.js
const express = require('express')
const {
  createBrand,
  getBrandDetails,
  updateBrand,
  deleteBrand,
  getAllBrands
} = require('../controllers/brandController')
const authenticateUser = require('../middlewares/authMiddleware')

const router = express.Router()

router.post('/create', authenticateUser, createBrand)
router.get('/:id', authenticateUser, getBrandDetails)
router.put('/:id', authenticateUser, updateBrand)
router.delete('/:id', authenticateUser, deleteBrand)
router.get('/', authenticateUser, getAllBrands)

module.exports = router
