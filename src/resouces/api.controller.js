'use strict'

const { todo, sequelize } = require('../db/models/index');

const formatResponseData = (data) => ({ data });

const DB_ERROR_TYPES = {
    NOT_NULL: '23502'
};

module.exports = {
    getTodos: async (req, res, next) => {
        try {
            const todos = await todo.findAll({
                order: [
                    ['id', 'ASC']
                ],
                raw: true
            });
            res.status(200).json(formatResponseData(todos));
        } catch (err) {
            next(err);
        }
    },
    postTodo: async (req, res, next) => {
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
            );
            await transaction.commit();
            res.status(200).json(formatResponseData(dataValues));
        } catch (err) {
            await transaction.rollback();
            if (err.parent.code === DB_ERROR_TYPES.NOT_NULL) {
                //非NULL違反だった時にエラーコードをセット
                err.status = 400;
            }
            next(err);
        }
    },
    putTodo: async (req, res, next) => {
        const targetTodoId = req.params.id;
        let transaction;
        try {
            const targetTodo = await todo.findByPk(targetTodoId);
            if (!targetTodo) {
                const err = new Error(`Could not find a ID:${targetTodoId}`)
                err.status = 404;
                return next(err);
            }
            transaction = await sequelize.transaction();
            const { title, body, completed = false } = req.body;
            const dataValues = await targetTodo.update(
                {
                    title,
                    body,
                    completed,
                },
                { transaction }
            );
            await transaction.commit();
            res.status(200).json(formatResponseData(dataValues));
        } catch (err) {
            next(err);
        }
    },
    deleteTodo: (req, res) => {
        send(res, 200, 'deleteTodo', false);
    }
};

const send = (res, status, data, json = true) => {
    res.status(status).send(json ? JSON.stringify(data) : data);
}; 