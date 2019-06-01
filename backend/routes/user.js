'use strict'

let express = require('express');
let UserController = require('../controllers/user');
let md_auth = require('../middlewares/authenticate');

let api = express.Router();

api.get('/all/:page?', md_auth.ensureAuth, UserController.index);
api.get('/only/:id', md_auth.ensureAuth, UserController.show);
api.post('/', UserController.store);
api.post('/login', UserController.login);
api.get('/pruebas', md_auth.ensureAuth, (req, res) => {
    res.send({ algo: 'algo' });
})
module.exports = api;