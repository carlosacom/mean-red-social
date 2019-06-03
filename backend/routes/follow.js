'use strict'


let express = require('express');

//controlador
let FollowController = require('../controllers/follow');

// middlewares
let md_auth = require('../middlewares/authenticate');

let api = express.Router();

api.get('/', FollowController.index);


module.exports = api;