const { pool } = require('./index');

// Function to clear all tables in the database
async function clearDatabase() {
  // Define the tables you want to clear
  const tables = ['users', 'organisations']; // Adjust with your actual table names

  // Iterate through each table and truncate it
  for (let table of tables) {
    const queryText = `TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`;
    try {
      await pool.query(queryText);
      console.log(`Table ${table} truncated.`);
    } catch (error) {
      console.error(`Error truncating table ${table}: ${error}`);
    }
  }
}

module.exports = {
  clearDatabase, // Export the clearDatabase function
};