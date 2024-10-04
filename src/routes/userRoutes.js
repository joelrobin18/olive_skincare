// src/routes/userRoutes.js
const express = require('express')
const router = express.Router()
const {
  updateUserProfile,
  deleteUserAccount
} = require('../controllers/userController')

router.put('/profile/:userId', updateUserProfile)
router.delete('/account/:userId', deleteUserAccount)

module.exports = router
