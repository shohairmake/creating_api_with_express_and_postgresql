'use strict'

const { todo, sequelize } = require('../db/models/index');

const formatResponseData = (data) => ({ data });

const DB_ERROR_TYPES = {
    NOT_NULL: '23502'
};

const setError = (message, code, next) => {
    const err = new Error(message)
    err.status = code;
    return next(err);
}

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
    getTodoById: async (req, res, next) => {
        const targetTodoId = req.params.id;
        try {
            const targetTodo = await todo.findByPk(targetTodoId);
            if (!targetTodo) {
                return setError(`Could not find a ID:${targetTodoId}`, 404, next);
            }
            res.status(200).json(formatResponseData(targetTodo));
        } catch (err) {
            next(err);
        }
    },
    putTodo: async (req, res, next) => {
        const targetTodoId = req.params.id;
        let transaction;
        try {
            transaction = await sequelize.transaction();
            const targetTodo = await todo.findByPk(targetTodoId);
            if (!targetTodo) {
                return setError(`Could not find a ID:${targetTodoId}`, 404, next);
            }
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
            await transaction.rollback();
            next(err);
        }
    },
    deleteTodo: async (req, res, next) => {
        const targetTodoId = req.params.id;
        let transaction;
        try {
            transaction = await sequelize.transaction();
            const targetTodo = await todo.findByPk(targetTodoId);
            if (!targetTodo) {
                return setError(`Could not find a ID:${targetTodoId}`, 404, next);
            }
            await targetTodo.destroy({ transaction });
            await transaction.commit();
            res.status(200).json(formatResponseData(targetTodo));
        } catch (err) {
            await transaction.rollback();
            next(err);
        }
    }
};