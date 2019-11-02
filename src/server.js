const express = require('express');
const app = express();
const morgan = require('morgan');
const router = require('./resouces/api.router');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/', router);

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

module.exports = app; 