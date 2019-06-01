'use strict'

let mongose = require('mongoose');
let Schema = mongose.Schema;

let FollowSchema = Schema({
    user: { type: Schema.ObjectId, ref: 'User' },
    followed: { type: Schema.ObjectId, ref: 'User' }
});

module.exports = mongose.model('Follow', FollowSchema);