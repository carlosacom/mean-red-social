'use strict'

let mongoosePaginate = require('mongoose-pagination');

//modelos 
let User = require('../models/user');
let Follow = require('../models/follow');

let FollowController = {
    index: (req, res) => {
        res.status(200).send({ message: 'hola mundo' });
    },
    store: (req, res) => {
        let params = req.body;
        let follow = new Follow();
        console.log(req.user);
        follow.user = req.user.sub;
        follow.followed = params.followed;
        follow.save((err, followStored) => {
            if (err) return res.status(500).send({ errors: `Error en el servidor: ${err}` });
            if (!followStored) return res.status(404).send({ errors: 'el seguimiento no se ha guardado' });
            return res.status(200).send(followStored);
        });
    },
    destroy: (req, res) => {
        Follow.find({ user: req.user.sub, followed: req.params.id }).remove(err => {
            if (err) return res.status(500).send({ errors: `Error en el servidor: ${err}` });
            return res.status(200).send({ message: 'se ha eliminado correctamente' });
        });
    },
    getFollowingUsers: (req, res) => {
        let user = (req.params.id) ? req.params.id : req.user.sub;
        let page = (req.params.page) ? req.params.page : 1;
        let itemPerPage = 10;
        Follow.find({ user }).populate({ path: 'followed' }).paginate(page, itemPerPage, (err, follows, total) => {
            if (err) return res.status(500).send({ errors: `Error en el servidor: ${err}` });
            if (!follows) return res.status(400).send({ errors: 'No estas siguiendo a ningun usuario' });
            return res.status(200).send({ total, pages: Math.ceil(total / itemPerPage), follows });
        });
    },
    getFollowedUsers: (req, res) => {
        let user = (req.params.id) ? req.params.id : req.user.sub;
        let page = (req.params.page) ? req.params.page : 1;
        let itemPerPage = 10;
        Follow.find({ followed: user }).populate({ path: 'user' }).paginate(page, itemPerPage, (err, follows, total) => {
            if (err) return res.status(500).send({ errors: `Error en el servidor: ${err}` });
            if (!follows) return res.status(400).send({ errors: 'No estas siguiendo a ningun usuario' });
            return res.status(200).send({ total, pages: Math.ceil(total / itemPerPage), follows });
        });
    },
    // devolver usuarios que sigo
    getMyfollows: (req, res) => {
        Follow.find({ user: req.user.sub }).populate('followed').exec((err, follows) => {
            if (err) return res.status(500).send({ errors: `Error en el servidor: ${err}` });
            if (!follows) return res.status(400).send({ errors: 'No estas siguiendo a ningun usuario' });
            return res.status(200).send(follows);
        });
    },
    //devolver usuarios que me siguen
    getFollowBacks: (req, res) => {
        Follow.find({ followed: req.user.sub }).populate('user').exec((err, follows) => {
            if (err) return res.status(500).send({ errors: `Error en el servidor: ${err}` });
            if (!follows) return res.status(400).send({ errors: 'No estas siguiendo a ningun usuario' });
            return res.status(200).send(follows);
        });
    }
};

module.exports = FollowController;