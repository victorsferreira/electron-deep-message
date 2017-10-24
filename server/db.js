class Database{
  constructor(){
    this.mongoose = require('mongoose');
    // this.mongoose.promise = require("bluebird");
  };

  connect(config){
    var connection = this.mongoose.connect(config.uri, {
        user: config.username,
        pass: config.password,
        useMongoClient: true
    });

    connection.then((db)=>{
        db.connection.on('connected', function () {
          console.log('Connected on ' + config.uri);
        });

        db.connection.on('error', function (err) {
          console.log('DB error: ', err);
        });
    })

    connection.on('connected', function (foo) {
      console.log('Connected on ' + config.uri,foo);
    });
  }
}

module.exports = new Database();
