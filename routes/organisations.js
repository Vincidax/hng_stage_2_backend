const express = require('express');
const router = express.Router();
const {
  getOrganisations,
  getOrganisationById,
  createNewOrganisation,
  addUserToOrganisation,
} = require('../controllers/organisationController');

router.get('/', getOrganisations);
router.get('/:orgId', getOrganisationById);
router.post('/', createNewOrganisation);
router.post('/:orgId/users', addUserToOrganisation);

module.exports = router;