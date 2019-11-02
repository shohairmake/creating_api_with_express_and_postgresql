'use strict'

const statusCode = {
    OK: 200,
    BAT: 400
};

module.exports = {
    getTodos: (req, res) => {
        send(res, statusCode.OK, 'getTodos', false);
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