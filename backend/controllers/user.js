'use strict'

let bcrypt = require('bcrypt-nodejs');
let mongoosePaginate = require('mongoose-pagination');
let fs = require('fs');
let path = require('path');
// modelo
let User = require('../models/user');
let Follow = require('../models/follow');
let Publication = require('../models/publication');
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
            userController.followsThisUser(req.user.sub, id).then(values => {
                return res.status(200).send({ user, values });
            });
        });
    },
    followsThisUser: async(identity_user_id, user_id) => {
        let following = await Follow.findOne({ user: identity_user_id, followed: user_id }).exec()
            .then(follow => follow)
            .catch(err => handleError(err));
        let followed = await Follow.findOne({ user: user_id, followed: identity_user_id }).exec()
            .then(follow => follow)
            .catch(err => handleError(err));
        return { following, followed };
    },
    followsUsersId: async(user) => {
        let following = await Follow.find({ user }).select({ _id: 0, __v: 0, user: 0 }).exec()
            .then(follows => {
                let follows_clean = [];
                follows.forEach(follow => follows_clean.push(follow.followed));
                return follows_clean;
            })
            .catch(err => handleError(err));
        let followed = await Follow.find({ followed: user }).select({ _id: 0, __v: 0, followed: 0 }).exec()
            .then(follows => {
                let follows_clean = [];
                follows.forEach(follow => follows_clean.push(follow.user));
                return follows_clean;
            })
            .catch(err => handleError(err));
        return { following, followed };
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
            userController.followsUsersId(req.user.sub)
                .then(values => {
                    return res.status(200).send({ users, total, pages: Math.ceil(total / itemsPerPage), follows: values });
                });
        });
    },
    update: (req, res) => {
        let user = req.user;
        let update = req.body;
        delete update.password;
        User.findByIdAndUpdate(user.sub, update, { new: true }, (err, userUpdated) => {
            if (err) return res.status(500).send({ errors: `Error al busar el usuario: ${err}` });
            if (!userUpdated) return res.status(404).send({ errors: 'no existe el usuario en la base de datos' });
            return res.status(200).send(userUpdated);
        });
    },
    uploadImage: (req, res) => {
        let user = req.user;
        if (req.files) {
            let file_path = req.files.image.path;
            let file_split = file_path.split('\\');
            let filename = file_split[file_split.length - 1];
            let ext_file = filename.split('\.')[1];
            if (ext_file != 'png' && ext_file != 'jpg' && ext_file != 'jpeg' && ext_file != 'gif') {
                return fs.unlink(file_path, (err) => {
                    return res.status(500).send({ errors: `Error en la subida de archivo: ${err}` });
                });
            }
            User.findByIdAndUpdate(user.sub, { image: filename }, { new: true }, (err, userUpdated) => {
                if (err) return res.status(500).send({ errors: `Error al buscar el usuario: ${err}` });
                if (!userUpdated) return res.status(404).send({ errors: 'no existe el usuario en la base de datos' });
                return res.status(200).send(userUpdated);
            });
        } else {
            return res.status(404).send({ errors: 'No se ha Subido Ningun Archivo' });
        }
    },
    getImage: (req, res) => {
        let image_file = req.params.imageFile;
        let path_file = `./uploads/users/${image_file}`;
        fs.exists(path_file, (exists) => {
            if (exists) {
                res.sendFile(path.resolve(path_file));
            } else {
                res.status(500).send({ errors: 'No existe la imagen' });
            }
        });
    },
    getCounters: (req, res) => {
        let id = (req.params.id) ? req.params.id : req.user.sub;
        userController.getCountFollow(id)
            .then(follows => res.status(200).send(follows));
    },
    getCountFollow: async user_id => {
        let following = await Follow.countDocuments({ user: user_id }).exec()
            .then(count => count)
            .catch(err => handleError(err));
        let followed = await Follow.countDocuments({ followed: user_id }).exec()
            .then(count => count)
            .catch(err => handleError(err));
        let publications = await Publication.countDocuments({ user: user_id }).exec()
        .then(count => count)
        .catch(err => handleError(err));

        return { followed, following, publications };
    },
};

module.exports = userController;