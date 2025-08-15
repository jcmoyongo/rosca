'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'picture', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'https://randomuser.me/api/portraits/lego/1.jpg' 
      // or another placeholder of your choice
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'picture');
  }
};
