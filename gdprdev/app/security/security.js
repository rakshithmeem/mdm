var Auth = require('../model/schema/authDB');

exports.validate = function (req,res,next) {

    var tokenID = ''; 
    var req = req;
    var res = res;

    if(req.method == 'GET'){
        tokenID = req.query.tokenID;
    }
    else{
        tokenID = req.body.tokenID;
    }

    console.log("Method: "+ req.method + ", TokenID: "+tokenID+", Verifiying..")
    
    Auth.findOne({authID : tokenID}, function(err, id){
        if(err){
            console.log('Error in getting tokenID')
            return
        } 
        if(!id){
            console.log('Token id is not found')
            return
        } else {
             console.log('Token Id is present')
             next();
        }
    });
    
    
}

