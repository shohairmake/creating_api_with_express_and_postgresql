const assert = require('power-assert');
const { todo, sequelize } = require('../../../src/db/models');
const requestHelper = require('../../helper/requestHelper');
const chalk = require('chalk');

const getTodos = async () => {
    const response = await requestHelper.request({
        method: 'get',
        endPoint: '/api/todos',
        statusCode: 200
    });
    return response.body.data;
};

describe(chalk.green('test_GET TODO BY ID_/api/todos/:id'), () => {
    before(async () => {
        const promises = [];
        for (let i = 0; i < 5; i++) {
            const insertTodo = {
                title: 'test title' + i,
                body: 'test body' + i
            };
            const promise = todo.create(insertTodo);
            promises.push(promise);
        }
        await Promise.all(promises);
    });
    after(async () => {
        await sequelize.truncate();
    });

    it('test of response 200', async () => {
        const initTodos = await getTodos();
        assert.strictEqual(initTodos.length, 5);
        const targetId = initTodos[0].id;
        const response = await requestHelper.request({
            method: 'get',
            endPoint: `/api/todos/${targetId}`,
            statusCode: 200
        });
        const targetTodo = response.body.data;
        assert.strictEqual(typeof targetTodo, 'object');
        assert.strictEqual(typeof targetTodo.id, 'number');
        assert.strictEqual(typeof targetTodo.title, 'string');
        assert.strictEqual(typeof targetTodo.body, 'string');
        assert.strictEqual(typeof targetTodo.completed, 'boolean');
        assert.strictEqual(typeof targetTodo.createdAt, 'string');
        assert.strictEqual(typeof targetTodo.updatedAt, 'string');
    });

    it('error if ID is invalid', async () => {
        const initTodos = await getTodos();
        const INVALID_ID = initTodos[4].id + 1;
        const response = await requestHelper.request({
            method: 'get',
            endPoint: `/api/todos/${INVALID_ID}`,
            statusCode: 404
        });

        assert.deepStrictEqual(response.body.error.message, `Could not find a ID:${INVALID_ID}`);
    });
});