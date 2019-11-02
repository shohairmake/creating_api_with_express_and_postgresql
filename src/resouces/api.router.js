const express = require('express');
const controller = require('./api.controller');
const router = express.Router();

router
    .route('/todos')
    .get(controller.getTodos)
    .post(controller.postTodo);
router
    .route('todos/:id')
    .put(controller.putTodo)
    .delete(controller.deleteTodo);

module.exports = router;