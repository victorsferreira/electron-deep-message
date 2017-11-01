const express = require('express');
const crypto = require('crypto');
const mongoose = require('mongoose');

var router = express.Router();

const model = require('./model');

router.get('/:code',function(req,res,next){
    var code = req.params.code;
    var last_id = req.query.last_id;
    // return

    var criteria = {code: code};
    if(last_id){
        var obj = {};
        obj['$lt'] = last_id;
        criteria._id = obj;
    }

    model.find(criteria, (err,data) => {
        if(!err){
            res.json(data.reverse());
        }
    })
    .limit(req.query.limit || 20)
    .sort({ _id: -1 });
});

router.post('/',function(req,res,next){
    generateNewCode(req.query.salt)
    .then((code)=>{
        res.status(201).json({
            code: code
        });
    })
    .catch((err)=>{
        res.status(500).json({
            message: err.message
        });
    })
});

function generateNewCode(salt){
    var id = new mongoose.Types.ObjectId;
    var code = crypto.createHash('md5').update(id+salt).digest("hex");

    return checkIfCodeIsNew(code)
    .then((is_new)=>{
        if(is_new){
            return code;
        }else{
            return generateNewCode(salt);
        }
    });
}

function checkIfCodeIsNew(code){
    return new Promise(function(resolve, reject){
        model.find({code: code}, (err,data) => {
            if(!err){
                if(data.length == 0){
                    resolve(true);
                }else resolve(false);
            }else reject();
        });
    });
}

function generate(){



}

function checkCode() {
    var id = new mongoose.Types.ObjectId;
    var hash = crypto.createHash('md5').update(id).digest("hex");

    return new Promise(function(reject, resolve){
        model.find({code: hash}, (err,data) => {
            if(!err){
                if(!data.length){
                    resolve(hash);
                }else resolve(false);
            }else reject();
        });
    });
}

function loopForCode(){
    return checkCode().then(function(hash){
        if(hash){
            return hash;
        }else{
            loopForCode();
        }
    })
}
//
// function next() {
//     return doSomething.then(function(result) {
//         if (result < someValue) {
//              // run the operation again
//              return next();
//         } else {
//              return result;
//         }
//     });
// }
//
// next().then(function(result) {
//       // process final result here
// }).catch(function(err) {
//     // process error here
// });

module.exports = router;
