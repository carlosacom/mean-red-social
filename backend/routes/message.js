'use strict'

let express = require('express');

let MessageController = require('../controllers/message');

let api = express.Router();

let md_auth = require('../middlewares/authenticate');

api.get('/', md_auth.ensureAuth, MessageController.index);
api.post('/', md_auth.ensureAuth, MessageController.store);
module.exports = api;