const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const { createUserTable } = require('./models/user');
const { createOrganisationTable } = require('./models/organisation');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Import routes
const authRoutes = require('./routes/auth');
const organisationRoutes = require('./routes/organisations');

// Route middleware
app.use('/auth', authRoutes);
app.use('/api/organisations', organisationRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the User Authentication API');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    await createUserTable();
    await createOrganisationTable();
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
