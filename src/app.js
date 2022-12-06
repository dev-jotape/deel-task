const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model')
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)
require('dotenv/config');

const routes = require('./routes');
routes(app);

module.exports = app;
