'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const dummyTodos = [1, 2, 3, 4, 5].map(num => {
      return {
        title: `dummy title ${num}`,
        body: `dummy body ${num}`,
        completed: false
      };
    });
    return queryInterface.bulkInsert('todos', dummyTodos, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('People', null, {});
  }
};
