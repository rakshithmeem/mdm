
const uuidv1 = require('uuid/v1');
var authentication = require('app/model/api/authentication');

/** This function Handles Webshortcuts
*/
var Profile = require('app/model/api/profile');

exports.ManageWebShortcuts = function (req, res) {

    if (!req.body) return res.sendStatus(400)
    var tokenID = req.body.tokenID;
    var profileName = req.body.profilename;

    console.log('Set WebShortcuts Profile, Name: ' + profileName);

    var webShortcutsUUID = uuidv1();


    var webShortcutsJson = {

        "PayloadContent": {

            "FullScreen": req.body.FullScreen,
            "Icon": "",
            "IsRemovable ": req.body.FullScreen,
            "Label": req.body.FullScreen,
            "PayloadDescription": "Configures settings for a web clip",
            "PayloadDisplayName": "Web Clip",
            "PayloadIdentifier": "com.apple.webClip.managed."+webShortcutsUUID,
            "PayloadType": "com.apple.webClip.managed",
            "PayloadUUID": webShortcutsUUID,
            "PayloadVersion": 1,
            "Precomposed": req.body.Precomposed,
            "URL": req.body.URL
            
        }
    }

    console.log("Webshortcut Json: " + JSON.stringify(webShortcutsJson));

    Profile.setWebClipProfile(tokenID, profileName, webShortcutsJson)

}

