const db = require('../db');
const { v4: uuidv4 } = require('uuid');

/**
 * Creates a new organisation in the database.
 * @param {string} name - The organisation's name.
 * @param {string} description - The organisation's description.
 * @returns {Promise<object>} The created organisation object.
 */
const createOrganisation = async (name, description) => {
  if (!name) {
    throw new Error('The name field is required.');
  }

  const orgId = uuidv4();
  const query = `
    INSERT INTO organisations (orgId, name, description)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [orgId, name, description];

  try {
    const { rows } = await db.query(query, values);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieves organisations by userId from the database.
 * @param {string} userId - The user's ID.
 * @returns {Promise<Array>} The list of organisations.
 */
const getOrganisationsByUserId = async (userId) => {
  const query = `
    SELECT o.* FROM organisations o
    JOIN user_organisations uo ON o.orgId = uo.orgId
    WHERE uo.userId = $1;
  `;
  const values = [userId];

  try {
    const { rows } = await db.query(query, values);
    return rows;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createOrganisation,
  getOrganisationsByUserId,
};