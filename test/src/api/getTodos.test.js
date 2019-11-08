const assert = require('power-assert');
const { todo, sequelize } = require('../../../src/db/models');
const requestHelper = require('../../helper/requestHelper');
const chalk = require('chalk');

describe(chalk.green('test_GET_/api/todos'), () => {
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
    //test of response 200
    it('test of response 200', async () => {
        const response = await requestHelper.request({
            method: 'get',
            endPoint: '/api/todos',
            statusCode: 200
        });
        const todos = response.body.data;
        assert.strictEqual(Array.isArray(todos), true);
        assert.strictEqual(todos.length, 5);
        todos.forEach(todo => {
            assert.strictEqual(typeof todo.id, 'number');
            assert.strictEqual(typeof todo.title, 'string');
            assert.strictEqual(typeof todo.body, 'string');
            assert.strictEqual(typeof todo.completed, 'boolean');
            assert.strictEqual(typeof todo.createdAt, 'string');
            assert.strictEqual(typeof todo.updatedAt, 'string');
        });
    });
});
