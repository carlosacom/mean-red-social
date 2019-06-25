'use strict'

let express = require('express');
let multipart = require('connect-multiparty');

// controllador
let PublicationController = require('../controllers/publication');


// middlewares
let md_auth = require('../middlewares/authenticate');
let md_upload = multipart({ uploadDir: './uploads/publications' });


let api = express.Router();

api.get('/', md_auth.ensureAuth, PublicationController.index);
api.get('/:id',md_auth.ensureAuth, PublicationController.show);
api.get('/image/:imageFile', PublicationController.getImage);
api.post('/', md_auth.ensureAuth, PublicationController.store);
api.post('/image/:id', md_auth.ensureAuth, md_upload, PublicationController.uploadImage);
api.delete('/:id', md_auth.ensureAuth, PublicationController.destroy);

module.exports = api;