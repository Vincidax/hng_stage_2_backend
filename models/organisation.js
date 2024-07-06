const db = require('../db');

const createOrganisationTable = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS organisations (
      orgId SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT
    );
  `;
  await db.query(queryText);
};

const createOrganisation = async (organisation) => {
  const queryText = `
    INSERT INTO organisations (name, description)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const values = [organisation.name, organisation.description];
  const { rows } = await db.query(queryText, values);
  return rows[0];
};

const getOrganisationsByUserId = async (userId) => {
  const queryText = `
    SELECT o.orgId, o.name, o.description
    FROM organisations o
    INNER JOIN user_organisations uo ON o.orgId = uo.orgId
    WHERE uo.userId = $1;
  `;
  const { rows } = await db.query(queryText, [userId]);
  return rows;
};

module.exports = {
  createOrganisationTable,
  createOrganisation,
  getOrganisationsByUserId,
};
