const assert = require('power-assert');
const { sequelize } = require('../../../src/db/models');
const requestHelper = require('../../helper/requestHelper');
const chalk = require('chalk');

const allTodos = async () => {
    const response = await requestHelper.request({
        method: 'get',
        endPoint: '/api/todos',
        statusCode: 200
    });
    return response.body.data;
};

describe(chalk.green('test_POST_/api/todos'), () => {
    after(async () => {
        //Delete all data in the model in the end
        await sequelize.truncate();
    });

    it('test of response 200', async () => {
        const initTodos = await allTodos();
        assert.strictEqual(initTodos.length, 0);

        const testTodo = {
            title: 'testTitle',
            body: 'testBody'
        }
        const response = await requestHelper.request({
            method: 'post',
            endPoint: '/api/todos',
            statusCode: 200
        }).send(testTodo);

        const createdTodo = response.body.data;
        assert.deepStrictEqual({ ...createdTodo }, {
            id: createdTodo.id,
            title: testTodo.title,
            body: testTodo.body,
            completed: createdTodo.completed,
            createdAt: createdTodo.createdAt,
            updatedAt: createdTodo.updatedAt
        });
        const todos = await allTodos();
        assert.strictEqual(Array.isArray(todos), true);
        assert.strictEqual(todos.length, 1);
    });

    it('400 error if title is missing', async () => {
        const failData = {
            body: 'test body'
        };
        const response = await requestHelper.request({
            method: 'post',
            endPoint: '/api/todos',
            statusCode: 400
        }).send(failData);
        assert.strictEqual(response.body.error, 'Server Error');
    });
    it('400 error if body is missing', async () => {
        const failData = {
            title: 'test title'
        };
        const response = await requestHelper.request({
            method: 'post',
            endPoint: '/api/todos',
            statusCode: 400
        }).send(failData);
        assert.strictEqual(response.body.error, 'Server Error');
    });
});