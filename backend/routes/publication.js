'use strict'

let express = require('express');
let multipart = require('connect-multiparty');

// controllador
let PublicationController = require('../controllers/publication');


// middlewares
let md_auth = require('../middlewares/authenticate');
let md_upload = multipart({ uploadDir: './uploads/publications' });


let api = express.Router();

api.get('/', PublicationController.index);

module.exports = api;