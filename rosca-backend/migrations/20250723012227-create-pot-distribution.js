// migration: create-pot-distributions.js
'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PotDistributions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      roscaGroupId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ROSCAGroups',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      recipientMemberId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'GroupMembers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      amount_distributed: Sequelize.FLOAT,
      distributed_on: Sequelize.DATE,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PotDistributions');
  }
};
