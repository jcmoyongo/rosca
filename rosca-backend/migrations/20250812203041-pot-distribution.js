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
        allowNull: false,
        references: { model: 'ROSCAGroups', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      recipientMemberId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'GroupMembers', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      amount_distributed: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      distributed_on: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PotDistributions');
  }
};
