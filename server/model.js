var db                       = require('./db');
    // db.mongoose.Promise      = require('bluebird');

var schema = new db.mongoose.Schema({
    code: String,
    message: String,
    datetime: Number
},{collection: 'message'});

module.exports = db.mongoose.model('Message', schema);
