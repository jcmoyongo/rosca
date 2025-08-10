// === models/index.js ===
const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user')(sequelize, Sequelize.DataTypes);
db.ROSCAGroup = require('./roscaGroup')(sequelize, Sequelize.DataTypes);
db.GroupMember = require('./groupMember')(sequelize, Sequelize.DataTypes);
db.Contribution = require('./contribution')(sequelize, Sequelize.DataTypes);
db.PotDistribution = require('./potDistribution')(sequelize, Sequelize.DataTypes);

// Associations
db.ROSCAGroup.belongsTo(db.User, { as: 'admin', foreignKey: 'adminUserId' });
db.GroupMember.belongsTo(db.User);
db.GroupMember.belongsTo(db.ROSCAGroup);
db.Contribution.belongsTo(db.GroupMember);
db.PotDistribution.belongsTo(db.ROSCAGroup);
db.PotDistribution.belongsTo(db.GroupMember, { as: 'recipient' });

module.exports = db;