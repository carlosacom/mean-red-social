'use strict'

let express = require('express');

let MessageController = require('../controllers/message');

let api = express.Router();

let md_auth = require('../middlewares/authenticate');

api.get('/', md_auth.ensureAuth, MessageController.index);
api.get('/received', md_auth.ensureAuth, MessageController.getReceivedMessages);
api.get('/emitted', md_auth.ensureAuth, MessageController.getEmittedMessages);
api.get('/pending', md_auth.ensureAuth, MessageController.getUnViewed);
api.get('/set-viewed', md_auth.ensureAuth, MessageController.setViewed);
api.post('/', md_auth.ensureAuth, MessageController.store);

module.exports = api;