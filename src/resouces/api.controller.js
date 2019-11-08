'use strict'

const { todo, sequelize } = require('../db/models/index');

const formatResponseData = (data) => ({ data });

const throwError = (errMessage, errCode) => {
    const err = new Error();
    err.message = errMessage;
    err.code = errCode;
    throw err;
};

const statusCode = {
    OK: 200,
    BAD_REQUEST: 400
};

module.exports = {
    getTodos: async (req, res) => {
        try {
            const todos = await todo.findAll({
                order: [
                    ['id', 'ASC']
                ],
                raw: true
            }).catch(
                err => {
                    throwError("Server Error", 500);
                }
            );
            res.status(200).json(formatResponseData(todos));
        } catch (err) {
            res.status(statusCode.BAD_REQUEST).json({ error: err.message });
        }
    },
    postTodo: async (req, res) => {
        let transaction;
        try {
            transaction = await sequelize.transaction();
            const { title, body, completed = false } = req.body;
            const dataValues = await todo.create(
                {
                    title,
                    body,
                    completed,
                },
                { transaction }
            ).catch(err => {
                throwError("Server Error", 500);
            });
            await transaction.commit();
            res.status(200).json(formatResponseData(dataValues));
        } catch (err) {
            await transaction.rollback();
            res.status(statusCode.BAD_REQUEST).json({ error: err.message });
        }
    },
    getTodoById: async (req, res) => {
        const targetTodoId = req.params.id;
        try {
            const targetTodo = await todo.findByPk(targetTodoId).catch(
                err => {
                    throwError("Server Error", 500);
                }
            );
            if (!targetTodo) {
                throwError("Not Found", 404);
            }
            res.status(200).json(formatResponseData(targetTodo));
        } catch (err) {
            res.status(statusCode.BAD_REQUEST).json({ error: err.message });
        }
    },
    putTodo: async (req, res) => {
        send(res, statusCode.OK, 'putTodo', false);
    },
    deleteTodo: (req, res) => {
        send(res, statusCode.OK, 'deleteTodo', false);
    }
};

const send = (res, status, data, json = true) => {
    res.status(status).send(json ? JSON.stringify(data) : data);
}; 