const db = require('../db');
const bcrypt = require('bcryptjs');

const createUserTable = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS users (
      userId SERIAL PRIMARY KEY,
      firstName VARCHAR(255) NOT NULL,
      lastName VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(50)
    );
  `;
  await db.query(queryText);
};

const createUser = async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const queryText = `
    INSERT INTO users (firstName, lastName, email, password, phone)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const values = [user.firstName, user.lastName, user.email, hashedPassword, user.phone];
  const { rows } = await db.query(queryText, values);
  return rows[0];
};

const findUserByEmail = async (email) => {
  const queryText = 'SELECT * FROM users WHERE email = $1';
  const { rows } = await db.query(queryText, [email]);
  return rows[0];
};

module.exports = {
  createUserTable,
  createUser,
  findUserByEmail,
};
