const db = require('../db');

/**
 * Creates a new organisation in the database.
 * @param {string} orgId - The unique organisation ID.
 * @param {string} name - The organisation's name (required).
 * @param {string} description - The organisation's description.
 * @returns {Promise<object>} The created organisation object.
 */
const createOrganisation = async (orgId, name, description) => {
  if (!name) {
    throw new Error('Name is required for organisation creation.');
  }

  const query = `
    INSERT INTO organisations (orgid, name, description)
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
 * Retrieves an organisation from the database based on its ID.
 * @param {string} orgId - The organisation ID.
 * @returns {Promise<object>} The organisation object.
 */
const getOrganisationById = async (orgId) => {
  const query = `
    SELECT * FROM organisations
    WHERE orgid = $1;
  `;
  const values = [orgId];

  try {
    const { rows } = await db.query(query, values);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

/**
 * Adds a user to an organisation in the database.
 * @param {string} orgId - The organisation ID.
 * @param {string} userId - The user ID to add to the organisation.
 */
const addUserToOrganisation = async (orgId, userId) => {
  const query = `
    INSERT INTO organisation_users (orgid, userid)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING;  -- Avoids duplicate entries if already exists
  `;
  const values = [orgId, userId];

  try {
    await db.query(query, values);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createOrganisation,
  getOrganisationById,
  addUserToOrganisation,
};