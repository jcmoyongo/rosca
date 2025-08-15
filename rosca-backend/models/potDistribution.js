'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PotDistribution extends Model {
    static associate(models) {
      PotDistribution.belongsTo(models.ROSCAGroup, { foreignKey: 'roscaGroupId' });
      PotDistribution.belongsTo(models.GroupMember, { foreignKey: 'recipientMemberId' });
    }
  }

  PotDistribution.init({
    roscaGroupId: DataTypes.INTEGER,
    recipientMemberId: DataTypes.INTEGER,
    amount_distributed: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    distributed_on: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'PotDistribution',
  });

  return PotDistribution;
};
