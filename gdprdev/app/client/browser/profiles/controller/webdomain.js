
const uuidv1 = require('uuid/v1');
var authentication = require('app/model/api/authentication');

/** This function Handles WebDomain
*/
var Profile = require('app/model/api/profile');

exports.ManageWebDomain = function (req, res) {

    if (!req.body) return res.sendStatus(400)
    var tokenID = req.body.tokenID;
    var profileName = req.body.profilename;

    console.log('Set WebDomain Profile, Name: ' + profileName);

    var webDomainUUID = uuidv1();

    var webDomainJson = {

        "PayloadContent": {
            // "EmailDomains": ["example.com"],
            // "PayloadDescription": "Configures Managed Domains",
            // "PayloadDisplayName": "Domains",
            // "PayloadIdentifier": "com.apple.domains."+webDomainUUID,
            // "PayloadType": "com.apple.domains",
            // "PayloadUUID": webDomainUUID,
            // "PayloadVersion": 1,
           // "SafariPasswordAutoFillDomains": ["example.com"],
            "WebDomains": req.body.WebDomains
        }
    }

    console.log("webDomain Json: " + JSON.stringify(webDomainJson));

   Profile.setManagedWebDomainProfile(tokenID, profileName, webDomainJson)

}

