// authController.js

const User = require('../models/user'); // Replace with your User model import
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res.status(422).json({ error: 'Name, email, and password are required' });
  }

  try {
    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' }); // Conflict status code
    }

    // Create new user
    const newUser = await User.create({ name, email, password });

    return res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: { user: newUser },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token (example function)
    const token = generateAuthToken(user);

    return res.status(200).json({
      status: 'success',
      message: 'User logged in successfully',
      data: { token },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

function generateAuthToken(user) {
  const payload = {
    user: {
      id: user.id,
    },
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // Example expiration time
}

module.exports = {
  registerUser,
  loginUser,
};