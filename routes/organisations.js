const express = require('express');
const { check } = require('express-validator');
const { createOrg, getOrgs } = require('../controllers/organisationsController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  [check('name').notEmpty().withMessage('Organisation name is required')],
  createOrg
);

router.get('/', authMiddleware, getOrgs);

module.exports = router;