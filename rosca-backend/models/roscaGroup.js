'use strict';
const crypto = require('crypto');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ROSCAGroup extends Model {
    static associate(models) {
      ROSCAGroup.belongsTo(models.User, { as: 'admin', foreignKey: 'adminUserId' });
      ROSCAGroup.hasMany(models.PotDistribution, { foreignKey: 'rosca_group_id' });
      ROSCAGroup.hasMany(models.GroupMember, { as: 'groupMembers', foreignKey: 'roscaGroupId' });

    }
  }

  ROSCAGroup.init({
    group_name: DataTypes.STRING,
    contribution_amount: DataTypes.DECIMAL(10, 2),
    contribution_interval: DataTypes.ENUM('weekly', 'monthly'),
    start_date: DataTypes.DATE,
    adminUserId: DataTypes.INTEGER,
    inviteToken: {
      type: DataTypes.STRING,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'ROSCAGroup',
  });

  ROSCAGroup.beforeCreate(group => {
    group.inviteToken = crypto.randomBytes(12).toString('hex');
  });

  return ROSCAGroup;
};
