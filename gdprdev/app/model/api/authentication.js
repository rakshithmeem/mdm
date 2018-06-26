
require('rootpath')();
let winston = require('config/logconfig/winston');
var log = winston.getLogger(null);
let User = require('app/model/schema/authDB');
var certificate = require('app/model/api/certificate')
var device = require('app/model/api/device')

var crypto = require('crypto');

/*
 * Send response in JSON format 
 */
var sendJSONResponse = function(res, status, content){
	res.status(status);
	res.json(content);
};

var sendResponse = function(res, status){
    res.status(status).send();
};

function getHash(email){
    var hash = crypto.createHash('sha256');
    hash.update(email);
    return hash.digest('hex');
}

/*
 * Register new email ID in the system
 * @param username - Name entered on the registration page
 * @param email - Email entered on the registration page. 
 * @param password -  Password entered by the user
 * @returns tokenID - created using Json Web Token library
 */
module.exports.authRegister = function(req, res){
    
    log.debug( 'inside register');

    profile = require('app/model/api/profile')
    if((!req.body.username)||(!req.body.password)||(!req.body.email)){
        log.error("all fields required")
        sendJSONResponse(res, 401,{
            "message":"UnAuthorized, all fields are required"
        });
        return;
    }
    log.debug("check DB email")
    log.debug( "req.body.username")
    /*Checking if email exists in DB*/
    User.findOne({email: req.body.email}, function(err, retQuery){
        console.log("email: ", req.body.email)
        if(err){
            log.debug( "error in finding email from DB "+err);
            console.log('debug', "error in finding email from DB "+err);

            return;
        }
        console.log('Here')
        log.debug("done finding")

        if(!retQuery){//if email does not exist in DB
            log.debug("inside retquery")
            console.log('debug',"inside retquery")

            try{
                var user = new User();
                user.email = req.body.email;
                user.username = req.body.username;
            } catch(e){
                console.log(e.message)
            }
           


            // certificate.addCertEmail(req.body.email);
            // profile.saveKeyEmail(req.body.email);
            // device.saveKeyEmail(req.body.email);
            user.SetPassword(req.body.password);
            var authID = user.generateJWT();
            user.authID = authID;
            user.orgIdHash = getHash(req.body.email);
            /* Saving the params to DB and 
             * returning tokenID in JSON as
             * reponse
             * */
            user.save(function(err){
                if(err){
                    console.log('Error while registering')
                }
                sendJSONResponse(res, 201, {
                    "tokenID":authID	
                }); 	
            });
            //res.end();
            return;
        }
        /* If email already exists, return 401 status*/
        if(retQuery.email == req.body.email){
            sendJSONResponse(res, 401,{
                "message":"email ID already registered"
            });
            return;
        }
    });	
    log.error("exiting register function")	;
};

/*
 * Login to the system
 * @param email - Registered email ID. 
 * @param password -  Registered password
 * @returns tokenID - created using Json Web Token library
 */
module.exports.authLogin = function(req, res){

    console.log('in login')
    console.log('password: ',req.body.password);
    console.log('username: ',req.body.username);
    console.log('email: ',req.body.email);

	if((!req.body.email)||(!req.body.password)){
		sendJSONResponse(res, 401,{
				"message":"UnAuthorized, all fields are required"
				});
		return;
	}
    /*Checking if email exists in DB*/
    User.findOne({email: req.body.email}, function(err, retQuery){
        if(err){
            console.log("error in finding email in DB");
            return;
        }
        if(!retQuery){
            console.log("email not present");
            sendJSONResponse(res, 401,{
                "message":"UnAuthorized, emailID not registered"
            });
            return;
        }
        
        if(!retQuery.verifyPassword(req.body.password)){
            sendJSONResponse(res, 401,{
                "message":"UnAuthorized, password not matching"
            });
            return;
        }	
        var authID = retQuery.generateJWT();
        retQuery.update({authID: authID}, function(err, authQuery){
            if((err) || (!authQuery)){
                sendJSONResponse(res, 401,{
                    "message":"UnAuthorized, Unable to generate tokenID"
                }); 
            }
            if(authQuery){
                sendJSONResponse(res, 201, {
                    "tokenID":authID	
                });
            }
        });
    });
};

/*
 * Logout of the system
 * @param tokenID - JWT 
 */
module.exports.authLogout = function(req, res){
    console.log('Logout API');

    User.findOne({authID: req.body.tokenID}, function(err, retQuery){
        if(err){
            console.log("error in finding email in DB");
            return;
        }
        if(!retQuery){
            console.log("authID not present");
            sendJSONResponse(res, 401,{
                "message":"UnAuthorized, authID not present"
            });
            return;
        }
        
        var authID = 0;
        retQuery.update({authID: authID}, function(err, authQuery){
            if((err) || (!authQuery)){
                sendResponse(res, 401)
            }
            if(authQuery){
                sendResponse(res, 200);
            }
        });
    });
};

/*
 * Change the password for the system
 * @param email - registered emailID
 * @param oldpassword - Currently registered password
 * @param newpassword - Newly created password
 * return @param tokenID - JWT 
 */
module.exports.changePassword = function(req, res){
    console.log('Change Password');
    if((!req.body.email)||(!req.body.oldpassword)||(!req.body.newpassword)){
        sendJSONResponse(res, 401,{
            "message":"UnAuthorized, all fields are required"
				});
		return;
	}
    /*Checking if email exists in DB*/
    User.findOne({email: req.body.email}, function(err, retQuery){
        if(err){
            console.log("error in finding email in DB");
            return;
        }
        if(!retQuery){
            console.log("email not present");
            sendJSONResponse(res, 401,{
                "message":"UnAuthorized, emailID not registered"
            });
            return;
        }
        if(!retQuery.verifyPassword(req.body.oldpassword)){
            sendJSONResponse(res, 401,{
                "message":"UnAuthorized, oldpassword not matching"
            });
            return;
        }
        retQuery.SetPassword(req.body.newpassword);
        var authID = retQuery.generateJWT();
        retQuery.update({salt:retQuery.salt,hash:retQuery.hash,authID:authID},function(err, passQuery){
            if((err) || (!passQuery)){
                sendJSONResponse(res, 401,{
                    "message":"UnAuthorized, Unable to generate tokenID"
                }); 
            }
            if(passQuery){
                sendJSONResponse(res, 201, {
                    "tokenID":authID	
                });
            }  
        });
    });
};

/*
 * De-register user from the system
 * @param email - registered emailID
 * @param tokenID - JWT 
 * Return Success/Failure
 */

module.exports.deregisterUser = function(req, res){
    console.log('De-register');
    User.findOne({authID: req.body.tokenID}, function(err, retQuery){
        if(err){
            console.log("error in finding email in DB");
            return;
        }
        if(!retQuery){
            console.log("authID not present");
            sendJSONResponse(res, 401,{
                "message":"UnAuthorized, authID not present"
            });
            return;
        }

        retQuery.remove(function(err, authQuery){
            if((err) || (!authQuery)){
                sendResponse(res, 401)
            }
            if(authQuery){
                sendResponse(res, 200);
            }
        });
    });
};

/*
 * Fetch email from DB using TokenID sent from Browser
 * @param tokenID - JWT 
 * Return corresponding emailID
 */
module.exports.fetchEmailByTokenId = function(tokenID, email){

    console.log('The tokn ID: '+tokenID)

    User.findOne({authID : tokenID}, 'email', function(err, emailObj){
        if(err){
            console.log('Error in getting email ID by TOKEN');
        }
        console.log('GOT THE MOBILE ID')
        email(emailObj.email);
    })
}

module.exports.fetchEmailByHash = function(hash, onFetch) {
    User.findOne({orgIdHash : hash}, 'email', function(err, emailObj){
        if(err){
            console.log('Error in getting email ID by TOKEN');
        }
        console.log('GOT THE MOBILE ID');
        onFetch(emailObj._id);
    })
}

/*
 * Fetch Hash from DB using Email
 * @param email - Registered eMail
 * Return corresponding hash value
 */
module.exports.fetchHashByEmail = function(email, hash){
    
    User.findOne({email : email}, 'orgIdHash', function(err, idHashObj){
        if(err){
            console.log('Error in getting email ID by TOKEN');
        }
        console.log('GOT THE MOBILE ID')
        ret = JSON.stringify(idHashObj);
        //myObj = JSON.parse(ret);
        console.log(ret);
        hash(idHashObj.orgIdHash);
    })
}
/*
 * Fetch Hash from DB using TokenID
 * @param tokenID - TokenID
 * Return corresponding hash value
 */
module.exports.fetchHashByTokenId = function(tokenId, hash){
    User.findOne({authID : tokenId}, 'orgIdHash', function(err, idHashObj){
        if(err){
            console.log('Error in getting email ID by TOKEN');
        }
        console.log('GOT THE HASH by tokenID '+idHashObj.orgIdHash);
        hash(idHashObj.orgIdHash);
    })
}

module.exports.fetchIdByHash = function(hash, onFetch){
    User.findOne({'orgIdHash' : hash}, '_id', function(err, idObj){
        if(err){
            console.log('Error in getting ID by hash '+err);
        }
        console.log('GOT THE Id by hash '+idObj._id);
        onFetch(idObj._id);
    })
}

module.exports.fetchIdByTokenId = function(tokenId, onFetch){
    User.findOne({'authID' : tokenId}, '_id', function(err, idObj){
        if(err){
            console.log('Error in getting ID by hash '+err);
        }
        console.log('GOT THE Id by tokenId '+idObj._id);
        onFetch(idObj._id);
    })
}

/*
 * De-register user from the system
 * @param email - registered emailID
 * @param tokenID - JWT 
 * Return Success/Failure
 */

module.exports.deregisterAdmin = function (email) {
    User.deleteOne({ '_id': Id }, function (err) {
        if (err) {
            console.log("error in finding email in DB");
            return;
        }
    })
}

// module.exports.listdevices = function (tokenId, cb) {

//     var deviceArray = [];

//     console.log('111')
//     User.findOne({'authID': tokenId}, 'deviceArray').populate('deviceArray').exec(function (err, deviceList) {

//         //console.log(JSON.stringify(deviceList))
//         if (err)
//             console.log('Error getting device list '+err)
//         else if (!deviceList) {
//             console.log('NULL object')
//         } else {

//             console.log(JSON.stringify(deviceList))
//             // deviceList[0].deviceList.forEach(function (list) {

//             //     var json = {
//             //         "devices": {
//             //             "deviceid": list.device.deviceID,
//             //             "Device": {
//             //                 "name": 'Some_dummy_name',
//             //                 "OSversion": list.device.authentication.osVersion,
//             //                 "platform": 'IOS',
//             //                 "buildversion": list.device.authentication.buildVersion,
//             //                 "model": list.device.authentication.productName,
//             //                 "modelname": list.device.authentication.productName,
//             //                 "productname": list.device.authentication.productName,
//             //                 "udid": list.device.authentication.UDID,
//             //                 "imei": list.device.authentication.IMEI,
//             //                 "serialnumber": list.device.authentication.serialNumber,
//             //                 "devicecapacity": '12GB',
//             //                 "freespace": '2GB',
//             //                 "batterylevel": '17'
//             //             },
//             //             "Network": {
//             //                 "bluetoothMAC": 'AB:CD:EF:AB:CD:EF',
//             //                 "WiFiMAC": 'AB:CD:EF:AB:CD:EF',
//             //                 "IPaddress": '192.168.0.8',
//             //                 "WifiSSD": 'ABCDEF'
//             //             }
//             //         }
//             //     };

//             //     //console.log(JSON.stringify(json))

//             //     deviceArray.push(json)
//             // })
//         }

//         cb(deviceArray);
//     }) 
// }