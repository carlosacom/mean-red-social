'use strict'

let mongoosePaginate = require('mongoose-pagination');

//modelos 
let User = require('../models/user');
let Follow = require('../models/follow');

let FollowController = {
    index: (req, res) => {
        res.status(200).send({ message: 'hola mundo' });
    },
};

module.exports = FollowController;