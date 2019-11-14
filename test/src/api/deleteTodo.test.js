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

describe(chalk.green('test_DELETE_/api/todos'), () => {
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

        const deleteId = initTodos[0].id;
        const response = await requestHelper.request({
            method: 'delete',
            endPoint: `/api/todos/${deleteId}`,
            statusCode: 200
        });
        const deletedTodo = response.body.data;
        assert.strictEqual(typeof deletedTodo, 'object');
        assert.strictEqual(typeof deletedTodo.id, 'number');
        assert.strictEqual(typeof deletedTodo.title, 'string');
        assert.strictEqual(typeof deletedTodo.body, 'string');
        assert.strictEqual(typeof deletedTodo.completed, 'boolean');
        assert.strictEqual(typeof deletedTodo.createdAt, 'string');
        assert.strictEqual(typeof deletedTodo.updatedAt, 'string');

        assert.deepStrictEqual({ ...deletedTodo }, {
            id: deletedTodo.id,
            title: deletedTodo.title,
            body: deletedTodo.body,
            completed: deletedTodo.completed,
            createdAt: deletedTodo.createdAt,
            updatedAt: deletedTodo.updatedAt
        });
        await requestHelper.request({
            method: 'get',
            endPoint: `/api/todos/${deleteId}`,
            statusCode: 404
        });
    });

    it('error if ID is invalid', async () => {
        const initTodos = await getTodos();
        const INVALID_ID = initTodos[3].id + 1;
        const response = await requestHelper.request({
            method: 'delete',
            endPoint: `/api/todos/${INVALID_ID}`,
            statusCode: 404
        });
        assert.deepStrictEqual(response.body.error.message, `Could not find a ID:${INVALID_ID}`);
    });
});