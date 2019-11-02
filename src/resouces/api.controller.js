'use strict'

const db = require('../db/models/');

const formatResponseData = (data) => ({ data });

const statusCode = {
    OK: 200,
    BAD_REQUEST: 400
};

module.exports = {
    async getTodos(req, res) {
        try {
            const todos = await Todo.findAll({
                order: [
                    ['id', 'ASC']
                ],
                raw: true
            });
            res.status(200).json(formatResponseData(todos));
        } catch (err) {
            res.status(err.statusCode).json({
                error: err
            });
        }
    },
    postTodo: (req, res) => {
        send(res, statusCode.OK, 'postTodo', false);
    },
    putTodo: (req, res) => {
        send(res, statusCode.OK, 'putTodo', false);
    },
    deleteTodo: (req, res) => {
        send(res, statusCode.OK, 'deleteTodo', false);
    }
};

const send = (res, status, data, json = true) => {
    res.status(status).send(json ? JSON.stringify(data) : data);
}; 