const express = require('express');
const {
  getOrganisations,
  getOrganisationById,
  createOrganisation,
  addUserToOrganisation,
} = require('../controllers/organisationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getOrganisations);
router.get('/:orgId', getOrganisationById);
router.post('/', createOrganisation);
router.post('/:orgId/users', addUserToOrganisation);

module.exports = router;
