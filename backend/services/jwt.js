'use strict'

let jwt = require('jwt-simple');
let moment = require('moment');
let environments = require('../environments/global');

exports.createToken = user => {
    let payload = {
        sub: user._id,
        name: user.name,
        nick: user.nick,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix(),
    };
    return jwt.encode(payload, environments.ket_jwt);
};