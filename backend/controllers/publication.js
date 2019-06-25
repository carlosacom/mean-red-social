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
        let user = req.user;
        let page = (req.query.page) ? req.query.page : 1 ;
        let itemsPerPage = 10;
        Follow.find({ user: user.sub }).populate('followed').exec((err, follows) => {
            if (err) return res.status(500).send({ errors: `Hubo un error: ${err}` });
            let followsClean = [];
            follows.forEach(follow => followsClean.push(follow));
            Publication.find({ user: {$in: followsClean} }).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {
                if (err) return res.status(500).send({ errors: `Hubo un error: ${err}` });
                return res.status(200).send({ total, publications, pages: Math.ceil(total / itemsPerPage), page });
            });
        });
    },
    show: (req, res) => {
        let publication_id = req.params.id;
        Publication.findById(publication_id).populate('user').exec((err, publication) => {
            if (err) return res.status(500).send({ errors: `Hubo un error: ${err}` });
            if (!publication) return res.status(404).send({ errors: 'No existe la publicación' });
            return res.status(200).send(publication);
        });
    },
    store: (req, res) => {
        let user = req.user;
        let params = req.body;
        if (!params.text) return res.status(400).send({ errors: 'Faltan datos para la publicación' });
        let publication = new Publication();
        publication.text = params.text;
        publication.file = null;
        publication.user = user.sub;
        publication.created_at = moment().unix();
        publication.save((err, publicationStored) => {
            if (err) return res.status(500).send({ errors: `Hubo un error: ${err}` });
            if (!publicationStored) return res.status(404).send({ errors: 'No se pudo realizar la publicación' });
            return res.status(200).send(publicationStored);
        });
    },
    destroy: (req, res)  => {
        let publication_id = req.params.id;
        let user = req.user;
        Publication.findOneAndDelete({ user: user.sub, _id: publication_id }, (err, publication) => {
            if (err) return res.status(500).send({ errors: `Hubo un error: ${err}` });
            if (!publication) return res.status(404).send({ errors: 'No existe la publicación' });
            return res.status(200).send(publication);
        });
    },
    uploadImage: (req, res) => {
        let publication_id = req.params.id;
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
            Publication.findOneAndUpdate({ _id: publication_id, user: user.sub }, { file: filename }, { new: true }, (err, publicationUpdated) => {
                if (err) return res.status(500).send({ errors: `Error al buscar el usuario: ${err}` });
                if (!publicationUpdated) return res.status(404).send({ errors: 'no existe la publicación' });
                return res.status(200).send(publicationUpdated);
            });
        } else {
            return res.status(404).send({ errors: 'No se ha Subido Ningun Archivo' });
        }
    },
    getImage: (req, res) => {
        let image_file = req.params.imageFile;
        let path_file = `./uploads/publications/${image_file}`;
        fs.exists(path_file, (exists) => {
            if (exists) {
                res.sendFile(path.resolve(path_file));
            } else {
                res.status(500).send({ errors: 'No existe la imagen' });
            }
        });
    },
};
module.exports = PublicationController;