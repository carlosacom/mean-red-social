'use strict'

let mongoose = require('mongoose');
let app = require('./app');
let port = 3000;


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso_red_social', { useNewUrlParser: true })
    .then(() => app.listen(port, () => console.log(`Server online: port: ${ port }`)))
    .catch(() => console.log('Server Error In Mongodb'));