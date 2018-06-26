
const uuidv1 = require('uuid/v1');
var authentication = require('app/model/api/authentication');

/** This function Device Passcode Details to a profile
*/
var Profile = require('app/model/api/profile');

exports.ManagePasscodeProfile = function (req, res) {

    if (!req.body) return res.sendStatus(400)
    var tokenID = req.body.tokenID;
    passcodeprofileName = req.body.profilename;

    console.log('Set Passcode Profile, Name: ' + passcodeprofileName);

    var passwordUUID = uuidv1();

    var passcodeJson = {

        "PayloadContent": {
            
                "PayloadDescription": "Configures passcode settings",
                "PayloadDisplayName": "Passcode",
                "PayloadIdentifier": "com.apple.mobiledevice.passwordpolicy." + passwordUUID,
                "PayloadType": "com.apple.mobiledevice.passwordpolicy",
                "PayloadUUID": passwordUUID,
                "PayloadVersion": 1,
                "allowSimple": req.body.allowSimple,
                "forcePIN": true,
                "maxFailedAttempts": parseInt(req.body.maxFailedAttempts),
                "maxGracePeriod": parseInt(req.body.maxGracePeriod),
                "maxInactivity": parseInt(req.body.maxInactivity),
                "maxPINAgeInDays": parseInt(req.body.maxPINAgeInDays),
                "minComplexChars": parseInt(req.body.minComplexChars),
                "minLength": parseInt(req.body.minLength),
                "pinHistory": parseInt(req.body.pinHistory),
                "requireAlphanumeric": req.body.requireAlphanumeric
            }
    }


    console.log("Passcode Json: " + JSON.stringify(passcodeJson));

    Profile.setPasscodeProfile(tokenID, passcodeprofileName, passcodeJson)

}

