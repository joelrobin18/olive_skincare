// src/routes/reviewRoutes.js
const express = require('express')
const {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview
} = require('../controllers/reviewController')
const authenticateUser = require('../middlewares/authMiddleware')

const router = express.Router()

router.post('/', authenticateUser, createReview)
router.get('/product/:productId', getProductReviews)
router.put('/:id', authenticateUser, updateReview)
router.delete('/:id', authenticateUser, deleteReview)

module.exports = router
