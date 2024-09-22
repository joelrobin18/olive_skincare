// src/controllers/authController.js
//TODO: Verify the emailID and phone number
//TODO: Update to GoogleAuth

const bcrypt = require('bcrypt');
const supabase = require('../supabaseClient');
const jwt = require('jsonwebtoken'); 

const JWT_SECRET = process.env.JWT_SECRET; 

async function registerUser(req, res) {
  const { name, email, phone_number, password, skin_type, hair_type, allergies } = req.body;

  if (!name || !email || !password ) {
    return res.status(400).json({ error: 'All required fields must be provided' });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          name,
          email,
          phone_number,
          password_hash: hashedPassword,
          skin_type,
          hair_type,
          allergies
        }
      ]);

    if (error) {
      return res.status(500).json({ error: `Failed to register user ${error.message}` });
    }

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err); 
    return res.status(500).json({ error: `Internal server error: ${err}` });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, password_hash, is_premium') 
      .eq('email', email)
      .single();

    if (error || !data) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, data.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: data.id, isPremium: data.is_premium },
      JWT_SECRET,
      { expiresIn: '1d' } 
    );

    return res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err); 
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function logoutUser(req, res) {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1]; 
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

  
    return res.status(200).json({ message: 'Logout successful, clear token on client-side' });
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

async function logoutUser(req, res) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1]; 

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.status(200).json({ message: 'Logout successful, clear token on client-side' });
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
module.exports = { registerUser, loginUser, logoutUser };
