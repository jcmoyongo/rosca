'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('GroupMembers', 'UserId', 'userId');
    await queryInterface.renameColumn('GroupMembers', 'ROSCAGroupId', 'roscaGroupId');
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('GroupMembers', 'userId', 'UserId');
    await queryInterface.renameColumn('GroupMembers', 'roscaGroupId', 'ROSCAGroupId');
  }
};
