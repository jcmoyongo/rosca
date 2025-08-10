'use strict';
const crypto = require('crypto'); // at the top if needed

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ROSCAGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ROSCAGroup.init({
    group_name: DataTypes.STRING,
    contribution_amount: DataTypes.FLOAT,
    contribution_interval: DataTypes.STRING,
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

   Group.beforeCreate(group => {
    group.inviteToken = crypto.randomBytes(12).toString('hex');
  });

  return ROSCAGroup;
};