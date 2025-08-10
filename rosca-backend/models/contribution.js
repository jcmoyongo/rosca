'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Contribution extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Contribution.init({
    groupMemberId: DataTypes.INTEGER,
    amount_paid: DataTypes.FLOAT,
    paid_on: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Contribution',
  });
  return Contribution;
};