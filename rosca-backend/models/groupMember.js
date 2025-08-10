'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupMember extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  GroupMember.init({
    userId: DataTypes.INTEGER,
    roscaGroupId: DataTypes.INTEGER,
    order_in_rotation: DataTypes.INTEGER,
    has_received_pot: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'GroupMember',
  });
  return GroupMember;
};