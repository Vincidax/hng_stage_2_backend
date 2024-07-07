const { createOrganisation, getOrganisationsByUserId } = require('../models/organisation');
const { validationResult } = require('express-validator');

const createOrg = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { name, description } = req.body;
  const userId = req.user.userId; // Assuming userId is added to req.user by auth middleware

  try {
    const org = await createOrganisation(name, description, userId);

    return res.status(201).json({
      status: 'success',
      message: 'Organisation created successfully',
      data: org,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};

const getOrgs = async (req, res) => {
  const userId = req.user.userId; // Assuming userId is added to req.user by auth middleware

  try {
    const orgs = await getOrganisationsByUserId(userId);

    return res.status(200).json({
      status: 'success',
      message: 'Organisations retrieved successfully',
      data: orgs,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};

module.exports = {
  createOrg,
  getOrgs,
};