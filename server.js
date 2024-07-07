require('dotenv').config(); // Load environment variables

const express = require('express');
const bodyParser = require('body-parser');
const authRouter = require('./routes/auth');
const organisationsRouter = require('./routes/organisations');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes that don't require authentication
app.use('/auth', authRouter);

// Middleware for authentication
app.use(authMiddleware);

// Routes that require authentication
app.use('/api/organisations', organisationsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = server; // Export server for testing purposes