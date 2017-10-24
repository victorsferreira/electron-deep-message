process.on('uncaughtException', function(err){
  //log
  console.log(err);
});

var config = require('./config');
var app = require('./express');
var db = require('./db');
var fs = require('fs');

module.exports = app.listen(config.port.webserver, function(){
    db.connect(config.db);
    console.log('Listening on port '+config.port.webserver);
});
