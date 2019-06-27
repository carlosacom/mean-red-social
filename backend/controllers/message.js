'use strict'

let moment = require('moment');
let mongoose_paginate = require('mongoose-pagination');

let User = require('../models/user');
let Follow = require('../models/follow');
let Message = require('../models/message');

let MessageController = {
    index: (req, res) => {
        return res.send('algo');
    },
    store: (req, res) => {
        let params = req.body;
        let user = req.user;
        if (!(params.text && params.receiver)) return res.status(400).send({ errors: 'Faltan datos para enviar el mensaje' });
        let message = new Message();
        message.emitter = user.sub;
        message.receiver = params.receiver;
        message.text = params.text;
        message.created_at = moment().unix();
        message.viewed = false;
        message.save((err, messageStoraged) => {
            if (err) return res.status(500).send({ errors: `Error en el servidor: ${err}` });
            if (!messageStoraged) return res.status(404).send({ errors: 'el mensaje no se ha guardado' });
            return res.status(200).send(messageStoraged);
        });
    }
};

module.exports = MessageController;