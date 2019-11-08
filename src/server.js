const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const router = require('./resouces/api.router');

app.use(express.json());
app.use(cors());
//cors default settings is like this
//    {"origin": "*",
//     "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
//     "preflightContinue": false,
//     "optionsSuccessStatus": 204}

app.use(express.urlencoded({ extended: true }));
app.use('/api', router);

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

module.exports = app; 