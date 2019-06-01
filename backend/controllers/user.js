'use strict'

let bcrypt = require('bcrypt-nodejs');
let mongoosePaginate = require('mongoose-pagination');
// modelo
let User = require('../models/user');

// servicios
let jwtAuth = require('../services/jwt');

let userController = {
    store: (req, res) => {
        let params = req.body;
        let user = new User();
        if (params.name && params.surname && params.nick && params.email && params.password) {
            user.role = 'user';
            user.image = null;
            user.name = params.name;
            user.surname = params.surname;
            user.nick = params.nick;
            user.email = params.email;
            // controlar usuarios duplicados
            User.find({
                $or: [
                    { email: user.email.toLowerCase() },
                    { nick: user.nick.toLowerCase() }
                ],
            }).exec((err, users) => {
                if (err) return res.status(500).send({ errors: `Error al guardar el usuario : ${err}` });
                if (users && users.length >= 1) return res.status(400).send({ errors: 'El email o el nick ya se encuentran registrados en el sistema' });
                else {
                    // encripta la contraseña
                    bcrypt.hash(params.password, null, null, (err, hash) => {
                        user.password = hash;
                        user.save((err, userStored) => {
                            if (err) return res.status(500).send({ errors: `Error al guardar el usuario : ${err}` });
                            if (userStored) {
                                user.password = undefined;
                                let token = jwtAuth.createToken(user);
                                return res.status(200).send({ user, token });
                            } else {
                                return res.status(400).send({ errors: 'No se pudo registrar el usuario' });
                            }
                        });
                    });
                }
            });
        } else {
            res.status(400).send({ errors: 'Faltan datos en el registro' });
        }
    },
    login: (req, res) => {
        let params = req.body;
        if (params.email && params.password) {
            User.findOne({ email: params.email }, (err, user) => {
                if (err) return res.status(500).send({ errors: `Error en inicio de sessión: ${err}` });
                if (user) {
                    bcrypt.compare(params.password, user.password, (err, check) => {
                        if (check) {
                            // logeado correctamente
                            user.password = undefined;
                            // generar el token
                            let token = jwtAuth.createToken(user);
                            return res.status(200).send({ user, token });
                        } else {
                            // contraseña incorrecta
                            res.status(400).send({ errors: 'Usuario o contraseña incorrecta' });
                        }
                    });
                } else {
                    res.status(400).send({ errors: 'Usuario o contraseña incorrecta' });
                }
            });
        } else {
            res.status(400).send({ errors: 'Faltan datos en el inicio de sesión' });
        }
    },
    show: (req, res) => {
        let id = req.params.id;
        User.findById(id, (err, user) => {
            if (err) return res.status(500).send({ errors: `Error al busar el usuario: ${err}` });
            if (!user) return res.status(404).send({ errors: 'no existe el usuario en la base de datos' });
            user.password = undefined;
            return res.status(200).send(user);
        });
    },
    index: (req, res) => {
        let page = 1;
        let itemsPerPage = 15;
        if (req.params.page) {
            page = req.params.page;
        }
        User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
            if (err) return res.status(500).send({ errors: `Error al buscar los usuarios: ${err}` });
            if (!users) return res.status(404).send({ errors: 'no hay usuarios disponibles' });
            return res.status(200).send({ users, total, pages: Math.ceil(total / itemsPerPage) });
        });
    },
    update: (req, res) => {

    }
};

module.exports = userController;