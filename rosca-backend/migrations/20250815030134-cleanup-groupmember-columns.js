module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('GroupMembers', 'UserId');
    await queryInterface.removeColumn('GroupMembers', 'ROSCAGroupId');
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('GroupMembers', 'UserId', Sequelize.INTEGER);
    await queryInterface.addColumn('GroupMembers', 'ROSCAGroupId', Sequelize.INTEGER);
  }
};
