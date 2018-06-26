
var RemoveProfile = require('app/client/mobile/apple/controller/commandmanager/commands/removeprofile');
var InstallProfile = require('app/client/mobile/apple/controller/commandmanager/commands/installprofile');
var NotifyAPNS = require('app/client/mobile/apple/controller/commandmanager/commands/notify');

const uuidv1 = require('uuid/v1');

/** This function creates a profile to be deployed to remote device
*/
var Profile = require('app/model/api/profile')

var sendJSONResponse = function(res, status, content){
	res.status(status);
	res.json(content);
};

exports.CreateProfile = function (req, res) {
    if (!req.body) return res.sendStatus(406)

    console.log('Create Profile..');
    console.log('Token ID:' + req.body.tokenID);
    console.log('Profile Name:' + req.body.profilename);
    console.log('Description:' + req.body.description);

    var tokenID = req.body.tokenID;
    var profileName = req.body.profilename;
    var profileDescriptor = req.body.description;


    var profileUUID = uuidv1();

    var profileMainPayload = {

        "PayloadDisplayName": profileName,
        "PayloadIdentifier": "com.apple.applicationaccess." + profileUUID,
        "PayloadOrganization": "MEEM",
        "PayloadRemovalDisallowed": false,
        "PayloadType": "Configuration",
        "PayloadUUID": profileUUID,
        "PayloadVersion": 1
    }

    var json = {
        'profilename': profileName,
        'OS': 1,
        'description': profileDescriptor,
        'profileidentifier': profileMainPayload
    }

    Profile.createProfile(tokenID, json, function (status) {
        if (status) {

            console.log("Profile Saved");

            // /** Save Default Restrictions*/
            var restrictionUUID = uuidv1();

            var restrictionsJson = {

                "PayloadContent":
                    {
                        "PayloadDescription": "Configures restrictions",
                        "PayloadDisplayName": "Restrictions",
                        "PayloadIdentifier": "com.apple.applicationaccess." + restrictionUUID,
                        "PayloadType": "com.apple.applicationaccess",
                        "PayloadUUID": restrictionUUID,
                        "PayloadVersion": 1,
                        "allowAddingGameCenterFriends": true,
                        "allowAirDrop": true,
                        "allowAirPlayIncomingRequests": true,
                        "allowAirPrint": true,
                        "allowAirPrintCredentialsStorage": true,
                        "allowAirPrintiBeaconDiscovery": true,
                        "allowAppCellularDataModification": true,
                        "allowAppInstallation": true,
                        "allowAppRemoval": true,
                        "allowAutoCorrection": true,
                        "allowAutomaticAppDownloads": true,
                        "allowBluetoothModification": true,
                        "allowBookstore": true,
                        "allowBookstoreErotica": true,
                        "allowCellularPlanModification": true,
                        "allowChat": true,
                        "allowDefinitionLookup": true,
                        "allowDeviceNameModification": true,
                        "allowDictation": true,
                        "allowEnablingRestrictions": true,
                        "allowEnterpriseAppTrust": true,
                        "allowEraseContentAndSettings": true,
                        "allowExplicitContent": true,
                        "allowFingerprintModification": true,
                        "allowGameCenter": true,
                        "allowGlobalBackgroundFetchWhenRoaming": true,
                        "allowInAppPurchases": true,
                        "allowKeyboardShortcuts": true,
                        "allowManagedAppsCloudSync": true,
                        "allowMultiplayerGaming": true,
                        "allowMusicService": true,
                        "allowNews": true,
                        "allowNotificationsModification": true,
                        "allowPairedWatch": true,
                        "allowPasscodeModification": true,
                        "allowPredictiveKeyboard": true,
                        "allowProximitySetupToNewDevice": true,
                        "allowRadioService": true,
                        "allowRemoteAppPairing": true,
                        "allowRemoteScreenObservation": true,
                        "allowSpellCheck": true,
                        "allowSpotlightInternetResults": true,
                        "allowSystemAppRemoval": true,
                        "allowUIAppInstallation": true,
                        "allowUIConfigurationProfileInstallation": true,
                        "allowVPNCreation": true,
                        "allowVideoConferencing": true,
                        "allowWallpaperModification": true,
                        "allowiTunes": true,
                        "forceAirDropUnmanaged": false,
                        "forceAirPrintTrustedTLSRequirement": false,
                        "forceAssistantProfanityFilter": false,
                        "forceAuthenticationBeforeAutoFill": true,
                        "forceClassroomAutomaticallyJoinClasses": false,
                        "forceClassroomUnpromptedAppAndDeviceLock": false,
                        "forceClassroomUnpromptedScreenObservation": false,
                        "forceWiFiWhitelisting": false,
                        "ratingApps": 1000,
                        "ratingMovies": 1000,
                        "ratingRegion": "us",
                        "ratingTVShows": 1000,
                    }
            }

            Profile.setRestrictionProfileDefault(tokenID, profileName, restrictionsJson);
            sendJSONResponse(res, 201,{
                "message":"Profile created!"
            });
        }
    });

    res.end();

};

/** This function updates profile details/name
*/

exports.UpdateProfile = function (req, res) {
    if (!req.body) return res.sendStatus(406)

    console.log('Update Profile..');
    console.log('Token ID:' + req.body.tokenID);
    console.log('Old Profile Name:' + req.body.profileoldname);
    console.log('New Profile Name:' + req.body.profilenewname);
    console.log('Description:' + req.body.description);

    var json = {
        'OS': 1,
        'profileoldname': req.body.profileoldname,
        'profilenewname': req.body.profilenewname,
        'description': req.body.description
    }

    Profile.updateProfile(req.body.tokenID, json);
    sendJSONResponse(res, 201,{
        "message":"Profile Updated!"
    });

    res.end();

};

/** This function deploy profile  to remote device
*/
exports.DeployProfile = function (req, res) {

    if (!req.body) return res.sendStatus(406)

    console.log('Deploy Profile..');
    console.log('Token ID:' + req.body.tokenID);
    console.log('Profile Name:' + req.body.profilename);

    var tokenID = req.body.tokenID;
    var profileName = req.body.profilename;
    var deviceID = req.body.deviceID;
    var profileUUID = uuidv1();


    Profile.getProfiles(tokenID, profileName, function (profileInfo, emailpayload, passcodepayload, webclippayload,certificatepayload,managedWebDomainpayload, restrictionpayload) {

        device.isProfileSame(deviceID, profileInfo.profileidentifier.PayloadUUID).then(function(){
            var totalPayloadContent = new Array;

            if (emailpayload){
                console.log("Email paylod present")
                totalPayloadContent.push(emailpayload.PayloadContent);
            }
            if (passcodepayload){
                console.log("Passcode paylod present")
                totalPayloadContent.push(passcodepayload.PayloadContent);
    
            }
            if (webclippayload){
                console.log("Passcode paylod present")
                totalPayloadContent.push(webclippayload.PayloadContent);
    
            }
            if (certificatepayload){
                console.log("certificate paylod present")
                totalPayloadContent.push(certificatepayload.PayloadContent);
            }
            if (managedWebDomainpayload){
                console.log("managedWebDomain paylod present")
                totalPayloadContent.push(managedWebDomainpayload.PayloadContent);
            }
    
            if (restrictionpayload) {
    
                console.log("Restriction paylod present")
    
                CreateRestrictionJson(restrictionpayload, function (restrictionJson) {
                    totalPayloadContent.push(restrictionJson);
        
                    if (profileInfo) {
                        var profileIdentifier = profileInfo.profileidentifier;
    
                        profileIdentifier["PayloadContent"] = totalPayloadContent;
    
                        console.log("Final: " + JSON.stringify(profileIdentifier));
    
                        var installprofile = new InstallProfile(req, res, profileIdentifier);
                        installprofile.push();
                        NotifyAPNS.notify(req, res);
                    }
    
                    sendJSONResponse(res, 201,{
                        "message":"Profile deployed!"
                    });
                
                    device.setProfileId(deviceID, profileInfo.profileidentifier.PayloadUUID)
                    res.end();    
                })
            }
            else{
    
                if (profileIdentifier) {
    
                    console.log("Restriction paylod present")
                    var profileIdentifier = profileInfo.profileidentifier;

                    profileIdentifier["PayloadContent"] = totalPayloadContent;
        
                    //console.log("Final: " + JSON.stringify(profileIdentifier));
        
                    var installprofile = new InstallProfile(req, res, profileIdentifier);
                    installprofile.push();
                    NotifyAPNS.notify(req, res);
                }

                res.end();
            }
        }).catch(function(){
            console.log('Delete the old profile to proceed')
            sendJSONResponse(res, 403,{
                "message":"Delete the old profile to proceed"
            });
        })
    })
};

/** This function deletes profile from  remote device,database
*/

exports.DeleteProfile = function (req, res) {
    if (!req.body) return res.sendStatus(406)

    console.log('Delete Profile..');
    console.log('Token ID:' + req.body.tokenID);
    console.log('Profile Name:' + req.body.profilename);

    var tokenID = req.body.tokenID;
    var profileName = req.body.profilename;
    var deviceID = req.body.deviceID;
    // Profile.deleteProfile(req.body.tokenID, req.body.profilename);

    Profile.getProfiles(tokenID, profileName, function (profileInfo, emailpayload, passcodepayload, restrictionpayload) {

        var profileIdentifier = profileInfo.profileidentifier.PayloadIdentifier;
        console.log("Identifier: " + JSON.stringify(profileIdentifier));

        var removeprofile = new RemoveProfile(req, res, profileIdentifier);
        removeprofile.push();

        NotifyAPNS.notify(req, res);
        sendJSONResponse(res, 201,{
            "message":"Profile deleted!"
        });
        console.log('deviceID '+deviceID);
        device.removeProfile(deviceID);
        res.end();

    })

};

function CreateRestrictionJson(restrictionpayload, cb) {

    var defaultRestrictions = restrictionpayload.default.PayloadContent;

    if (restrictionpayload.functionality) {

        console.log("Functinality paylod present")
        var devicefunctionality = restrictionpayload.functionality.PayloadContent;
        /**Functionality */
        var keys = Object.keys(devicefunctionality);
        keys.forEach(function (item) {
            //  console.log("Key: " + item);
            defaultRestrictions[item] = devicefunctionality[item];
        })
    }
    if (restrictionpayload.security) {
        console.log("Security paylod present")

        /**Security */
        var devicesecurity = restrictionpayload.security.PayloadContent;

        keys = Object.keys(devicesecurity);
        keys.forEach(function (item) {
            //console.log("Key: " + item);
            defaultRestrictions[item] = devicesecurity[item];
        })
    }
    if (restrictionpayload.advancedSecurity) {
        console.log("AdvancedSecurity paylod present")

        /**Advanced Security */
        var deviceadvancedsecurity = restrictionpayload.advancedSecurity.PayloadContent;

        keys = Object.keys(deviceadvancedsecurity);
        keys.forEach(function (item) {
            // console.log("Key: " + item);
            defaultRestrictions[item] = deviceadvancedsecurity[item];
        })
    }
    if (restrictionpayload.icloudProfile) {
        console.log("icloud paylod present")

        /**Advanced Security */
        var icloud = restrictionpayload.icloudProfile.PayloadContent;

        keys = Object.keys(icloud);
        keys.forEach(function (item) {
            // console.log("Key: " + item);
            defaultRestrictions[item] = icloud[item];
        })
    }

    if (restrictionpayload.browserProfile) {
        
        console.log("browser paylod present")
        /**Advanced Security */
        var browser = restrictionpayload.browserProfile.PayloadContent;

        keys = Object.keys(browser);
        keys.forEach(function (item) {
            // console.log("Key: " + item);
            defaultRestrictions[item] = browser[item];
        })
    }

    if (restrictionpayload.networkProfile) {
        
        console.log("network paylod present")
        /**Advanced Security */
        var network = restrictionpayload.networkProfile.PayloadContent;

        keys = Object.keys(network);
        keys.forEach(function (item) {
            // console.log("Key: " + item);
            defaultRestrictions[item] = network[item];
        })
    }

    if (restrictionpayload.contentRating) {
        
        console.log("content rating paylod ")
        var rating = restrictionpayload.contentRating.PayloadContent;

        keys = Object.keys(rating);
        keys.forEach(function (key) {
            // console.log("Key: " + key);
            defaultRestrictions[key] = rating[key];
        })
    }

    if (restrictionpayload.privacy) {
        
        console.log("privacy paylod ")
        var privacy = restrictionpayload.privacy.PayloadContent;

        keys = Object.keys(privacy);
        keys.forEach(function (key) {
            // console.log("Key: " + key);
            defaultRestrictions[key] = privacy[key];
        })
    }

    if (restrictionpayload.applications) {
        
        console.log("applications paylod ")
        var applications = restrictionpayload.applications.PayloadContent;

        keys = Object.keys(applications);
        keys.forEach(function (key) {
            // console.log("Key: " + key);
            defaultRestrictions[key] = applications[key];
        })
    }

    
    cb(defaultRestrictions);

}

