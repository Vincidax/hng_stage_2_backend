const { createOrganisation, getOrganisationsByUserId } = require('../models/organisation');

const getOrganisations = async (req, res) => {
  const userId = req.user.userId;

  try {
    const organisations = await getOrganisationsByUserId(userId);
    return res.status(200).json({
      status: 'success',
      message: 'Organisations fetched successfully',
      data: { organisations },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getOrganisationById = async (req, res) => {
  const { orgId } = req.params;

  try {
    const organisation = await getOrganisationById(orgId);
    if (!organisation) {
      return res.status(404).json({
        status: 'Not Found',
        message: 'Organisation not found',
        statusCode: 404,
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Organisation fetched successfully',
      data: { organisation },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const createOrganisation = async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user.userId;

  if (!name) {
    return res.status(422).json({
      errors: [{ field: 'name', message: 'Name is required' }],
    });
  }

  try {
    const newOrganisation = await createOrganisation({ name, description, userId });

    return res.status(201).json({
      status: 'success',
      message: 'Organisation created successfully',
      data: { organisation: newOrganisation },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addUserToOrganisation = async (req, res) => {
  const { orgId } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(422).json({
      errors: [{ field: 'userId', message: 'User ID is required' }],
    });
  }

  try {
    await addUserToOrganisation(orgId, userId);
    return res.status(200).json({
      status: 'success',
      message: 'User added to organisation successfully',
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getOrganisations,
  getOrganisationById,
  createOrganisation,
  addUserToOrganisation,
};
