const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Function to test database connection
async function testConnection() {
  let client;
  try {
    // Connect to the database
    client = await pool.connect();
    console.log('Database connection successful!');
  } catch (error) {
    console.error('Error connecting to database:', error.message);
  } finally {
    // Release the client back to the pool
    if (client) {
      client.release();
    }
  }
}

// Function to clear the database
async function clearDatabase() {
  let client;
  try {
    client = await pool.connect();
    await client.query('TRUNCATE TABLE users CASCADE');
    await client.query('TRUNCATE TABLE organisations CASCADE');
    console.log('Tables truncated.');
  } catch (error) {
    console.error('Error truncating tables:', error.message);
  } finally {
    if (client) {
      client.release();
    }
  }
}

module.exports = { testConnection, clearDatabase, pool };