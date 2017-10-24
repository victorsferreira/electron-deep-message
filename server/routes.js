var express = require('express');
var router = express.Router();

const model = require('./model');

router.get('/:code',function(req,res,next){
    var code = req.params.code;
    var last_id = req.query.last_id;

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
    .limit(req.query.limit || 2)
    .sort({ _id: -1 });
});

module.exports = router;
