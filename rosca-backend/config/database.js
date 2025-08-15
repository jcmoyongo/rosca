// === config/database.js ===
const { Sequelize } = require('sequelize');

// Load environment variables
require('dotenv').config(); // loads DB credentials from .env

const sequelize = new Sequelize(
  process.env.DB_NAME,    // database name
  process.env.DB_USER,    // database username
  process.env.DB_PASS,    // database password
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
    logging: false,       // set to console.log to see queries
  }
);

module.exports = sequelize;