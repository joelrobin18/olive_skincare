// src/server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const ingredientRoutes = require('./routes/ingredientRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/ingredients', ingredientRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
