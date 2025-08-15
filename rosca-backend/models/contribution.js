'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Contribution extends Model {
    static associate(models) {
      Contribution.belongsTo(models.GroupMember, { foreignKey: 'groupMemberId' });
    }
  }

  Contribution.init({
    groupMemberId: DataTypes.INTEGER,
    amount_paid: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    paid_on: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Contribution',
  });

  return Contribution;
};
