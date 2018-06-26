var Profile = require('app/model/api/profile');

exports.ManageCertificatePofile = function (req, res) {
    if (!req.body) return res.sendStatus(400)
    var tokenID = req.body.tokenID;
    var profileName = req.body.profilename;

    console.log('Profile Name: ' + profileName);

    var certJson = {
        "PayloadContent": {
            "Certificate": req.body.Certificate,
            "Password": req.body.Password
         }
    }
    console.log("certJson : " + JSON.stringify(certJson));
    Profile.setCertificatepayload(tokenID, profileName, certJson);
}