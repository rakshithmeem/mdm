
var rimraf = require('rimraf');
var accDir = global.__basedir + process.env.ADMIN_ACC_PATH + "/"

var fileUploadPath = __basedir + '/Accounts/'

module.exports.delete_adminDir = function (hash , cb) {
    /*
    This sanity check is to make sure we are deleting only account associated with the Admin email 
    not the whole account Dir.
    */
        if (accDir.indexOf("/Accounts") > -1) {
            console.log("Accounts dir exists");
            if (hash.length > 0) {
                rimraf(accDir+hash, cb);
            }
        }
    
    }

module.exports.parseCheckinCommandAuthDetail = function(ciObj, checkinCB) {

    var keys = ciObj["plist"]["dict"]["key"];
    var strings = ciObj["plist"]["dict"]["string"];

    keyValObj = {};
    
    for(var i = 0; i<keys.length; i++){
        keyValObj[keys[i]] = strings[i];
    }
    //console.log('******'+JSON.stringify(keyValObj));
    checkinCB(keyValObj);
}

module.exports.parseCheckinCommandTokenUpdate = function(ciObj, checkinCB) {

    var keys = ciObj["plist"]["dict"]["key"];
    var strings = ciObj["plist"]["dict"]["string"];
    var data =  ciObj["plist"]["dict"]["data"];

    keyValObj = {};
    
    for(var i = 0, j = 0; i<keys.length; i++){
        if(keys[i] == 'AwaitingConfiguration'){
            keyValObj[keys[i]] = false;
            continue;
        }
        if(keys[i] == 'Token'){
            keyValObj[keys[i]] = data[0];
            continue;
        } else if(keys[i] == 'UnlockToken'){
            keyValObj[keys[i]] = data[1];
            continue;
        }
        keyValObj[keys[i]] = strings[j++];
    }
    checkinCB(keyValObj)
}

