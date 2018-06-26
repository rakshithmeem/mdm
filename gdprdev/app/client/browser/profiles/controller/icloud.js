var authentication = require('app/model/api/authentication');

/** This function Saves Device Restrictions Details to a profile
*/

var Profile = require('app/model/api/profile');

exports.ManageiCloudProfile = function (req, res) {

    if (!req.body) return res.sendStatus(400)
    var tokenID = req.body.tokenID;
    var ProfileName = req.body.profilename;
    var type = req.body.type;

    console.log('Set iCloud Restrictions, profile name: ' + ProfileName);

    var iCloudJson = {

        "PayloadContent": {
            
            "allowCloudBackup": false,
            "allowCloudDocumentSync": false,
            "allowPhotoStream": false,
            "allowCloudKeychainSync": false,
            "allowCloudPhotoLibrary": false,
            "allowSharedStream": false,
            "allowEnterpriseBookBackup": false,
            "allowEnterpriseBookMetadataSync": false
        }
    }


}