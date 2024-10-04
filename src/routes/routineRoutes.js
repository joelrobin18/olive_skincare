const express = require('express')
const router = express.Router()
const {
  createRoutine,
  getAllRoutines,
  getRoutine,
  updateRoutine,
  deleteRoutine
} = require('../controllers/routineController')
const authMiddleware = require('../middlewares/authMiddleware')

// Apply auth middleware to protect the routes
router.post('/', authMiddleware, createRoutine)
router.get('/user', authMiddleware, getAllRoutines)
router.get('/:routineId', authMiddleware, getRoutine)
router.put('/:routineId', authMiddleware, updateRoutine)
router.delete('/:routineId', authMiddleware, deleteRoutine)

module.exports = router
