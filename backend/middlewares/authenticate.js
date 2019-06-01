'use strict'

let jwt = require('jwt-simple');
let environments = require('../environments/global');
let moment = require('moment');

exports.ensureAuth = (req, res, next) => {
    if (!req.headers.authorization) return res.status(403).send({ errors: 'No hay token' })
    let token = req.headers.authorization.replace(/['"]+/g, '');
    try {
        var payload = jwt.decode(token, environments.ket_jwt);
        if (payload.exp >= moment.unix()) return res.status(401).send({ errors: 'Token Expirado' });
    } catch (e) {
        return res.status(401).send({ errors: 'Token No Valido' });
    }
    req.user = payload;
    next();
};