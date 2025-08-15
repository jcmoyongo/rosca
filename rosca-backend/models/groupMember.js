'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class GroupMember extends Model {
    static associate(models) {
      GroupMember.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
      GroupMember.belongsTo(models.ROSCAGroup, { as: 'roscaGroup', foreignKey: 'roscaGroupId' });
      GroupMember.hasMany(models.Contribution, { foreignKey: 'groupMemberId' });
    }
  }

  GroupMember.init({
    userId: DataTypes.INTEGER,
    roscaGroupId: DataTypes.INTEGER,
    order_in_rotation: DataTypes.INTEGER,
    has_received_pot: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  }, {
    sequelize,
    modelName: 'GroupMember',
  });

  return GroupMember;
};
