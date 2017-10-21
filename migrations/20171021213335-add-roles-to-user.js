'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
    queryInterface.addColumn(
      'users', 
      'role', { type : Sequelize.STRING, defaultValue : 'user' });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
    */
    queryInterface.removeColumn('users', 'role');
  }
};
