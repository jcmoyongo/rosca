// === config/database.js ===
const { Sequelize } = require('sequelize');
module.exports = new Sequelize('rosca_db', 'rosca_admin', 'admin', {
    host: 'localhost',
    dialect: 'postgres',
});