// // createTables.js
// require('dotenv').config();
// const { Client } = require('pg');

// // Connect to Supabase using PostgreSQL connection string
// const client = new Client({
//   connectionString: process.env.SUPABASE_CONNECTION_STRING,
// });

// client.connect();

// // Define SQL queries to create tables

// const createTables = async () => {
//   try {
//     // Create Users Table
//     await client.query(`
//       CREATE TABLE IF NOT EXISTS users (
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(100) NOT NULL,
//         email VARCHAR(120) UNIQUE NOT NULL,
//         phone_number VARCHAR(15),
//         password_hash VARCHAR(128) NOT NULL,
//         skin_type VARCHAR(50) NOT NULL,
//         hair_type VARCHAR(50) NOT NULL,
//         allergies JSON,
//         is_premium BOOLEAN DEFAULT FALSE
//       );
//     `);

//     // Create Brands Table
//     await client.query(`
//       CREATE TABLE IF NOT EXISTS brands (
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(100) NOT NULL,
//         official_website VARCHAR(200)
//       );
//     `);

//     // Create Ingredients Table
//     await client.query(`
//       CREATE TABLE IF NOT EXISTS ingredients (
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(100) NOT NULL,
//         is_allergen BOOLEAN DEFAULT FALSE,
//         is_carcinogen BOOLEAN DEFAULT FALSE,
//         not_suitable_for_babies BOOLEAN DEFAULT FALSE
//       );
//     `);

//     // Create Products Table
//     await client.query(`
//       CREATE TABLE IF NOT EXISTS products (
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(100) NOT NULL,
//         brand_id INTEGER REFERENCES brands(id) ON DELETE CASCADE,
//         category VARCHAR(100) NOT NULL,
//         ingredients JSON,
//         is_for_kids BOOLEAN DEFAULT FALSE,
//         contains_carcinogen BOOLEAN DEFAULT FALSE
//       );
//     `);

//     // Create ProductIngredients Table for Many-to-Many relationship
//     await client.query(`
//       CREATE TABLE IF NOT EXISTS product_ingredients (
//         product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
//         ingredient_id INTEGER REFERENCES ingredients(id) ON DELETE CASCADE,
//         quantity VARCHAR(100),
//         PRIMARY KEY (product_id, ingredient_id)
//       );
//     `);

//     // Create Routines Table
//     await client.query(`
//       CREATE TABLE IF NOT EXISTS routines (
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//         product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
//         days_per_week INTEGER NOT NULL,
//         last_used TIMESTAMPTZ,
//         recommended_limit INTEGER NOT NULL,
//         notification_status BOOLEAN DEFAULT FALSE
//       );
//     `);

//     // Create Reviews Table
//     await client.query(`
//       CREATE TABLE IF NOT EXISTS reviews (
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//         product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
//         rating INTEGER NOT NULL,
//         comment TEXT,
//         created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
//       );
//     `);

//     // Create ScannerUsage Table
//     await client.query(`
//       CREATE TABLE IF NOT EXISTS scanner_usage (
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//         product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
//         result JSON
//       );
//     `);

//     // Create SaleNotifications Table
//     await client.query(`
//       CREATE TABLE IF NOT EXISTS sale_notifications (
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//         brand_id INTEGER REFERENCES brands(id) ON DELETE CASCADE,
//         whatsapp_number VARCHAR(15),
//         notification_sent BOOLEAN DEFAULT FALSE
//       );
//     `);

//     // Create Dermatologists Table
//     await client.query(`
//       CREATE TABLE IF NOT EXISTS dermatologists (
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(100) NOT NULL,
//         specialization VARCHAR(100),
//         contact_info VARCHAR(200),
//         rating FLOAT
//       );
//     `);

//     // Create Appointments Table
//     await client.query(`
//       CREATE TABLE IF NOT EXISTS appointments (
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//         dermatologist_id INTEGER REFERENCES dermatologists(id) ON DELETE CASCADE,
//         appointment_time TIMESTAMPTZ NOT NULL,
//         is_virtual BOOLEAN DEFAULT FALSE,
//         status VARCHAR(50) NOT NULL
//       );
//     `);

//     console.log('Tables created successfully!');
//   } catch (err) {
//     console.error('Error creating tables:', err);
//   } finally {
//     client.end();
//   }
// };

// createTables();

require('dotenv').config()
const mysql = require('mysql2/promise')

// Connect to MySQL database
const client = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'joelrobin',
  database: process.env.DB_NAME || 'skincare'
})

const createTables = async () => {
  try {
    const connection = await client.getConnection()

    // Create Users Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(120) UNIQUE NOT NULL,
        phone_number VARCHAR(15),
        password_hash VARCHAR(128) NOT NULL,
        skin_type VARCHAR(50) NOT NULL,
        hair_type VARCHAR(50) NOT NULL,
        allergies JSON,
        is_premium BOOLEAN DEFAULT FALSE
      );
    `)

    // Create Brands Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS brands (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        official_website VARCHAR(200)
      );
    `)

    // Create Ingredients Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ingredients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        is_allergen BOOLEAN DEFAULT FALSE,
        is_carcinogen BOOLEAN DEFAULT FALSE,
        not_suitable_for_babies BOOLEAN DEFAULT FALSE
      );
    `)

    // Create Products Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        brand_id INT,
        category VARCHAR(100) NOT NULL,
        is_for_kids BOOLEAN DEFAULT FALSE,
        contains_carcinogen BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE
        created_by TEXT
        description TEXT
      );
    `)

    // Create ProductIngredients Table for Many-to-Many relationship
    await connection.query(`
      CREATE TABLE IF NOT EXISTS product_ingredients (
        product_id INT,
        ingredient_id INT,
        quantity VARCHAR(100),
        PRIMARY KEY (product_id, ingredient_id),
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
      );
    `)

    // Create Routines Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS routines (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        product_id INT,
        days_per_week INT NOT NULL,
        last_used TIMESTAMP NULL,
        recommended_limit INT NOT NULL,
        notification_status BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      );
    `)

    // Create Reviews Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        product_id INT,
        rating INT NOT NULL,
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      );
    `)

    // Create ScannerUsage Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS scanner_usage (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        product_id INT,
        result JSON,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      );
    `)

    // Create SaleNotifications Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS sale_notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        brand_id INT,
        whatsapp_number VARCHAR(15),
        notification_sent BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE
      );
    `)

    // Create Dermatologists Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS dermatologists (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        specialization VARCHAR(100),
        contact_info VARCHAR(200),
        rating FLOAT
      );
    `)

    // Create Appointments Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        dermatologist_id INT,
        appointment_time TIMESTAMP NOT NULL,
        is_virtual BOOLEAN DEFAULT FALSE,
        status VARCHAR(50) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (dermatologist_id) REFERENCES dermatologists(id) ON DELETE CASCADE
      );
    `)

    console.log('Tables created successfully!')
    connection.release()
  } catch (err) {
    console.error('Error creating tables:', err)
  } finally {
    client.end()
  }
}

createTables()
