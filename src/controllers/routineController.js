// src/controllers/routineController.js
const supabase = require('../supabaseClient')

// Create a new routine
async function createRoutine (req, res) {
  const userId = req.user.userId
  const {
    day_per_month,
    recommended_limit,
    notification_status,
    routine_name,
    start_time,
    end_time,
    steps,
    products
  } = req.body

  if (req.body.user_id) {
    return res
      .status(400)
      .json({ error: 'You cannot specify user_id in the request body.' })
  }

  try {
    const { data, error } = await supabase.from('routines').insert([
      {
        user_id: userId,
        day_per_month,
        recommended_limit,
        notification_status,
        routine_name,
        start_time,
        end_time,
        steps,
        products
      }
    ])

    if (error) return res.status(400).json({ error: error.message })
    return res
      .status(201)
      .json({ message: 'Routine created successfully', routine: data })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

// Get all routines for the logged-in user
async function getAllRoutines (req, res) {
  const userId = req.user.userId

  try {
    const { data, error } = await supabase
      .from('routines')
      .select(
        'user_id, day_per_month,last_used,recommended_limit,notification_status,routine_name,start_time,end_time,steps,is_active,products'
      )
      .eq('user_id', userId)

    if (error) return res.status(400).json({ error: error.message })
    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

async function getRoutine (req, res) {
  const userId = req.user.userId
  const { routineId } = req.params 

  if (!routineId) {
    return res.status(400).json({ error: 'Routine ID is required.' })
  }

  try {
    const { data, error } = await supabase
      .from('routines')
      .select(
        'user_id, day_per_month, last_used, recommended_limit, notification_status, routine_name, start_time, end_time, steps, is_active, products'
      )
      .eq('id', routineId) 
      .eq('user_id', userId) 

    if (error) return res.status(400).json({ error: error.message })

    if (data.length === 0) {
      return res
        .status(404)
        .json({ error: 'Routine not found or does not belong to the user.' })
    }

    return res.status(200).json(data[0]) 
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

// Update a routine
async function updateRoutine (req, res) {
  const userId = req.user.userId
  const { routineId } = req.params
  const updates = req.body
  if (req.body.user_id) {
    return res
      .status(400)
      .json({ error: 'You cannot specify user_id in the request body.' })
  }
  try {
    const { data: routine, error: findError } = await supabase
      .from('routines')
      .select('user_id')
      .eq('id', routineId)
      .single()

    if (findError || routine.user_id !== userId) {
      return res
        .status(403)
        .json({ error: 'You can only update your own routines.' })
    }

    const { data, error } = await supabase
      .from('routines')
      .update(updates)
      .eq('id', routineId)

    if (error) return res.status(400).json({ error: error.message })
    return res
      .status(200)
      .json({ message: 'Routine updated successfully', routine: data })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

// Delete a routine
async function deleteRoutine (req, res) {
  const userId = req.user.userId
  const { routineId } = req.params

  try {
    // Verify if the routine belongs to the logged-in user
    const { data: routine, error: findError } = await supabase
      .from('routines')
      .select('user_id')
      .eq('id', routineId)
      .single()

    if (findError || routine.user_id !== userId) {
      return res
        .status(403)
        .json({ error: 'You can only delete your own routines.' })
    }

    const { data, error } = await supabase
      .from('routines')
      .delete()
      .eq('id', routineId)

    if (error) return res.status(400).json({ error: error.message })
    return res.status(200).json({ message: 'Routine deleted successfully' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

module.exports = {
  createRoutine,
  getAllRoutines,
  getRoutine,
  updateRoutine,
  deleteRoutine
}
