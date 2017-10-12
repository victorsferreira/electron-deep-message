class Database{
  constructor(){
    this.mongoose = require('mongoose');
    this.mongoose.promise = require("bluebird");
  };

  connect(config){
    var connection = this.mongoose.connect(config.uri, { user: config.username, pass: config.password }).connection;

    connection.on('connected', function () {
      console.log('Connected on ' + config.uri);
    });

    connection.on('error', function (err) {
      console.log('DB error: ', err);
    });
  }
}

module.exports = new Database();
