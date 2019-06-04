'use strict'

let express = require('express');
let bodyParser = require('body-parser');

let app = express();

// cargar rutas
let user_routes = require('./routes/user');
let follow_routes = require('./routes/follow');
let publication_routes = require('./routes/publication');

// middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// cors

// rutas
app.use('/users', user_routes);
app.use('/follows', follow_routes);
app.use('/publications', publication_routes);
//exportar
module.exports = app;