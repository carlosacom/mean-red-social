'use strict'

let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let app = express();

// cargar rutas
let user_routes = require('./routes/user');
let follow_routes = require('./routes/follow');
let publication_routes = require('./routes/publication');
let message_routes = require('./routes/message');

// middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// cors
app.use(cors ({ origin:true, credentials:true }));
// rutas
app.use('/users', user_routes);
app.use('/follows', follow_routes);
app.use('/publications', publication_routes);
app.use('/messages', message_routes);
//exportar
module.exports = app;