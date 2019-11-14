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
const testData = {
    title: 'put_test title',
    body: 'put_test body',
    completed: true
};

describe(chalk.green('test_PUT_/api/todos'), () => {
    before(async () => {
        const promises = [];
        for (let i = 0; i < 5; i++) {
            const todoData = {
                title: 'test title' + i,
                body: 'test body' + i
            };
            const promise = todo.create(todoData);
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

        const updateId = initTodos[0].id;
        const response = await requestHelper.request({
            method: 'put',
            endPoint: `/api/todos/${updateId}`,
            statusCode: 200
        }).send(testData);
        const updatedTodo = response.body.data;
        assert.strictEqual(typeof updatedTodo, 'object');
        assert.strictEqual(typeof updatedTodo.id, 'number');
        assert.strictEqual(typeof updatedTodo.title, 'string');
        assert.strictEqual(typeof updatedTodo.body, 'string');
        assert.strictEqual(typeof updatedTodo.completed, 'boolean');
        assert.strictEqual(typeof updatedTodo.createdAt, 'string');
        assert.strictEqual(typeof updatedTodo.updatedAt, 'string');

        assert.deepStrictEqual({ ...updatedTodo }, {
            id: updatedTodo.id,
            title: testData.title,
            body: testData.body,
            completed: testData.completed,
            createdAt: updatedTodo.createdAt,
            updatedAt: updatedTodo.updatedAt
        });
        assert.strictEqual(updatedTodo.createdAt < updatedTodo.updatedAt, true);
    });

    it('error if ID is invalid', async () => {
        const initTodos = await getTodos();
        const INVALID_ID = initTodos[4].id + 1;
        const response = await requestHelper.request({
            method: 'put',
            endPoint: `/api/todos/${INVALID_ID}`,
            statusCode: 404
        }).send(testData);

        assert.deepStrictEqual(response.body.error.message, `Could not find a ID:${INVALID_ID}`);
    });
});