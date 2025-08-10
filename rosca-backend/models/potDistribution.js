'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PotDistribution extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PotDistribution.init({
    roscaGroupId: DataTypes.INTEGER,
    recipientMemberId: DataTypes.INTEGER,
    amount_distributed: DataTypes.FLOAT,
    distributed_on: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'PotDistribution',
  });
  return PotDistribution;
};