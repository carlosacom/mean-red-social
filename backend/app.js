'use strict'

let express = require('express');
let bodyParser = require('body-parser');

let app = express();

// cargar rutas
let user_routes = require('./routes/user');

// middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// cors

// rutas
app.use('/users', user_routes);
//exportar
module.exports = app;