// Full ROSCA Backend Boilerplate

// === server.js ===
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // React Vite dev server
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const db = require('./models');

app.use(express.json());

// Import central router
const routes = require('./routes/index'); // path to your index.js
app.use('/api', routes); // <- all routes will be prefixed with /api


const PORT = process.env.PORT || 5000;
db.sequelize.sync().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});



