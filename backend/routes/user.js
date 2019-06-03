'use strict'

let express = require('express');
let multipart = require('connect-multiparty');

// controlador
let UserController = require('../controllers/user');

// middlewares
let md_auth = require('../middlewares/authenticate');
let md_upload = multipart({ uploadDir: './uploads/users' });

let api = express.Router();

api.get('/all/:page?', md_auth.ensureAuth, UserController.index);
api.get('/only/:id', md_auth.ensureAuth, UserController.show);
api.get('/image/:imageFile', UserController.getImage);
api.post('/', UserController.store);
api.post('/login', UserController.login);
api.post('/upload-image', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.put('/', md_auth.ensureAuth, UserController.update);
module.exports = api;