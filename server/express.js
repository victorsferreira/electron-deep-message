const express = require('express');
const body_parser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const app = express();

app.use(helmet());

app.use(cors({
    origin: config.cors
}));

app.use(body_parser.urlencoded({
    limit: '2mb',
    extended: false
}));

app.use(body_parser.json({
    limit: '2mb'
}));

app.use(compression());

app.use('/', require('./routes'));

module.exports = app;
