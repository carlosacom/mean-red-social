'use strict'
let path = require('path');
let fs = require('fs');
let moment = require('moment');
let mongoosePaginate = require('mongoose-pagination');

//modelos
let Publication = require('../models/publication');
let User = require('../models/user');
let Follow = require('../models/follow');

let PublicationController = {
    index: (req, res) => {
        res.status(200).send({ algo: 'algo' });
    }
};
module.exports = PublicationController;