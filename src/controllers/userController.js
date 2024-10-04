// src/controllers/userController.js
const supabase = require('../supabaseClient')

async function updateUserProfile (req, res) {
  const { userId } = req.params
  const updates = req.body

  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)

    if (error) return res.status(400).json({ error: error.message })
    return res.status(200).json({ message: 'User updated successfully' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

async function deleteUserAccount (req, res) {
  const { userId } = req.params

  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single()

    if (userError) {
      return res.status(404).json({ error: 'User not found' })
    }

    const { data, error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId)

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    return res.status(200).json({ message: 'Account deleted successfully' })
  } catch (err) {
    console.error('Delete user error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { updateUserProfile, deleteUserAccount }
