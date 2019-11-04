'use strict'

const { todo, sequelize } = require('../db/models/index');

const formatResponseData = (data) => ({ data });

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
            });
            res.status(200).json(formatResponseData(todos));
        } catch (err) {
            res.status(err.statusCode).json({
                error: err
            });
        }
    },
    postTodo: async (req, res, next) => {
        try {
            const dataValues = await sequelize.transaction(
                async transaction => {
                    const { title, body, completed = false } = req.body;
                    return await todo.create(
                        {
                            title,
                            body,
                            completed,
                        },
                        { transaction }
                    );
                }
            );
            //トランザクション処理の終了を明記しなくても良いのか？ataValuesで終了できてるのか？
            //例 await transaction.commit();
            res.status(200).json(formatResponseData(dataValues));
        } catch (err) {
            res.status(err.statusCode).json({ error: err });
            next(err);
        }
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