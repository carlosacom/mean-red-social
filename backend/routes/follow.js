'use strict'


let express = require('express');

//controlador
let FollowController = require('../controllers/follow');

// middlewares
let md_auth = require('../middlewares/authenticate');

let api = express.Router();

api.get('/', FollowController.index);
api.get('/followed/:id?/:page?', md_auth.ensureAuth, FollowController.getFollowedUsers);
api.get('/show/:id?/:page?', md_auth.ensureAuth, FollowController.getFollowingUsers);
api.post('/', md_auth.ensureAuth, FollowController.store);
api.delete('/:id', md_auth.ensureAuth, FollowController.destroy);

module.exports = api;