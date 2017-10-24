const http = require('http');
const faye = require('faye');

const config = require('./config');
const db = require('./db');

const server = http.createServer(),
bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45});

bayeux.attach(server);
server.listen(config.port.bayeux, function(){
    db.connect(config.db);
    console.log('Bayeux server running on port '+config.port.bayeux)
});

bayeux.on('subscribe', function(client_id, channel){
    // console.log('subscription',client_id, channel)
    //     var model = require('./model');
    //
    // // var code = req.params.code;
    //
    // var code = channel.substr(1);
    //     console.log('code',code)
    // model.find({code: code},(err,data)=>{
    //     if(!err){
    //         console.log('data',data)
    //         // res.json(data);
    //     }
    // });
});

bayeux.on('publish', function(client_id, channel, data){
    var model = require('./model');

    model.create({
        message: data.text,
        datetime: Date.now(),
        code: channel.substr(1)
    },(err,data)=>{
        console.log('entrou')
    });
});
