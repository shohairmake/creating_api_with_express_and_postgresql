'use strict';
module.exports = (sequelize, DataTypes) => {
  const todos = sequelize.define('todos', {
    title: DataTypes.STRING,
    body: DataTypes.TEXT,
    completed: DataTypes.BOOLEAN
  }, {
    underscored: true,
  });
  todos.associate = function(models) {
    // associations can be defined here
  };
  return todos;
};