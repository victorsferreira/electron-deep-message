var db                       = require('../../config/db');
    db.mongoose.Promise      = require('bluebird');

var schema = new db.mongoose.Schema({
    code: String,
    message: String,
    datetime: Number
},{collection: 'portfolio'});

module.exports = db.mongoose.model('portfolio', schema);
