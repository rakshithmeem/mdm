var authentication = require('app/model/api/authentication');

/** This function Saves Device Restrictions Details to a profile
*/

var Profile = require('app/model/api/profile');

exports.ManageRestrictionProfile = function (req, res) {

    if (!req.body) return res.sendStatus(400)
    var tokenID = req.body.tokenID;
    var restrctionProfileName = req.body.profilename;
    var type = req.body.type;

    console.log('Set Restriction Profile, Name: ' + restrctionProfileName);


    if (type == "devicefunctionality") {

        console.log('Adding Device Functionality');

        var functionalityJson = {

            "PayloadContent":
                {
                    "allowCamera": req.body.allowCamera ,
                    "allowScreenShot": req.body.allowScreenshot ,
                    "allowVoiceDialing": req.body.allowVoiceDialing ,
                    "allowAssistant": req.body.allowAssistant ,
                    "allowAssistantWhileLocked": req.body.allowAssistantWhileLocked ,
                    "allowActivityContinuation": req.body.allowActivityContinuation 
                }
        }

        Profile.setFunctionality(tokenID, restrctionProfileName, functionalityJson);

    }
    else if (type == "security") {

        console.log('Adding Device Security');

        var securityJson = {

            "PayloadContent":
                {
                    "allowOpenFromManagedToUnmanaged": req.body.allowOpenFromManagedToUnmanaged ,
                    "allowOpenFromUnmanagedToManaged": req.body.allowOpenFromUnmanagedToManaged ,
                    "forceEncryptedBackup": req.body.forceEncryptedBackup ,
                    "allowPassbookWhileLocked": req.body.allowPassbookWhileLocked ,
                    "allowFingerprintForUnlock": req.body.allowFingerprintForUnlock 
                }

        }
        Profile.setSecurity(tokenID, restrctionProfileName, securityJson);
    }
    else if (type == "advancedsecurity") {

        console.log('Adding Device Advanced Security');

        var advancedSecurityJson = {
            "PayloadContent":
                {
                    "allowUntrustedTLSPrompt": req.body.allowUntrustedTLSPrompt ,
                    "forceITunesStorePasswordEntry": req.body.forceITunesStorePasswordEntry ,
                    "forceWatchWristDetection": req.body.forceWatchWristDetection 
                }
        }
        Profile.setAdvancedSecurity(tokenID, restrctionProfileName, advancedSecurityJson);

    }
    else if (type == "icloud") {

        console.log('Adding iCloud  Settings');

        var iCloudJson = {

            "PayloadContent": {

                "allowCloudBackup": req.body.allowCloudBackup ,
                "allowCloudDocumentSync": req.body.allowCloudDocumentSync ,
                "allowPhotoStream": req.body.allowPhotoStream ,
                "allowCloudKeychainSync": req.body.allowCloudKeychainSync ,
                "allowCloudPhotoLibrary": req.body.allowCloudPhotoLibrary ,
                "allowSharedStream": req.body.allowSharedStream ,
                "allowEnterpriseBookBackup": req.body.allowEnterpriseBookBackup ,
                "allowEnterpriseBookMetadataSync": req.body.allowEnterpriseBookMetadataSync 
            }
        }

        console.log("icloud Json: " + JSON.stringify(iCloudJson));
        Profile.setiCloudProfile(tokenID, restrctionProfileName, iCloudJson)
    }
    else if (type == "browser") {

        console.log('Adding Browser  Settings');

        var browserJson = {

            "PayloadContent": {
                "allowSafari": req.body.allowSafari,
                "safariAllowAutoFill": req.body.safariAllowAutoFill,
                "safariForceFraudWarning": req.body.safariForceFraudWarning,
                "safariAllowJavaScript": req.body.safariAllowJavaScript,
                "safariAllowPopups": req.body.safariAllowPopups,
                "safariAcceptCookies": parseInt(req.body.safariAcceptCookies)
            }
        }

        console.log("browserJson Json: " + JSON.stringify(browserJson));
        Profile.setBrowserProfile(tokenID, restrctionProfileName, browserJson)
    }
    else if(type == "network"){
        console.log('Adding Network  Settings');

        var networkJson = {
            "PayloadContent": {
                "allowGlobalBackgroundFetchWhenRoaming": req.body.allowGlobalBackgroundFetchWhenRoaming,
            }
        }
        console.log("networkJson Json: " + JSON.stringify(networkJson));
        Profile.setNetworkProfile(tokenID, restrctionProfileName, networkJson)

    }

  else if(type == "contentrating"){
        console.log('Adding Content  Rating');

        var contentratingJson = {
            "PayloadContent": {
                "ratingRegion": req.body.ratingRegion,
            }
        }
        console.log("contentrating Json: " + JSON.stringify(contentratingJson));
        Profile.setContentratingProfile(tokenID, restrctionProfileName, contentratingJson)
    }

    else if(type == "privacy"){
        console.log('Adding privacy  ');

        var privacy = {
            "PayloadContent": {
                "allowDiagnosticSubmission": req.body.allowDiagnosticSubmission,
                "forceLimitAdTracking": req.body.forceLimitAdTracking,
                "allowLockScreenSettings": req.body.allowLockScreenSettings,
                "allowLockScreenControlCenter": req.body.allowLockScreenControlCenter,
                "allowLockScreenNotificationsView": req.body.allowLockScreenNotificationsView,
                "allowLockScreenTodayView": req.body.allowLockScreenTodayView
            }
        }
        console.log("privacy Json: " + JSON.stringify(privacy));
        Profile.setPrivacyProfile(tokenID, restrctionProfileName, privacy)
    }

    else if(type == "applications"){
        console.log('Adding applications  ');

        var applications = {
            "PayloadContent": {
                "allowInAppPurchases": req.body.allowInAppPurchases,
                "allowiTunes": req.body.allowiTunes
            }
        }
        console.log("privacy Json: " + JSON.stringify(applications));
        Profile.setApplicationsProfile(tokenID, restrctionProfileName, applications)
    }

    res.sendStatus(200);

}



// exports.ManageRestrictionProfile = function (req, res) {

//     if (!req.body) return res.sendStatus(400)
//     var tokenID = req.body.tokenID;
//     var restrctionProfileName = req.body.profilename;
//     var type = req.body.type;

//     console.log('Token: ' + tokenID + ' Verified');
//     console.log('Set Restriction Profile, Name: ' + restrctionProfileName);

//     var restrictionsJson = {

//         "PayloadContent":
//             {
//                 "PayloadDescription": "Configures restrictions",
//                 "PayloadDisplayName": "Restrictions",
//                 "PayloadIdentifier": "com.apple.applicationaccess.0BCCB6B5-3C5D-4F45-A5F0-0997C56570A6",
//                 "PayloadType": "com.apple.applicationaccess",
//                 "PayloadUUID": "0BCCB6B5-3C5D-4F45-A5F0-0997C56570A6",
//                 "PayloadVersion": 1,
//                 "allowActivityContinuation": req.body.activitycontinuation ,
//                 "allowAddingGameCenterFriends": true,
//                 "allowAirDrop": true,
//                 "allowAirPlayIncomingRequests": true,
//                 "allowAirPrint": true,
//                 "allowAirPrintCredentialsStorage": true,
//                 "allowAirPrintiBeaconDiscovery": true,
//                 "allowAppCellularDataModification": true,
//                 "allowAppInstallation": true,
//                 "allowAppRemoval": true,
//                 "allowAssistant": req.body.assistant ,
//                 "allowAssistantWhileLocked": req.body.assistantwhilelocked ,
//                 "allowAutoCorrection": true,
//                 "allowAutomaticAppDownloads": true,
//                 "allowBluetoothModification": true,
//                 "allowBookstore": true,
//                 "allowBookstoreErotica": true,
//                 "allowCamera": req.body.camera ,
//                 "allowCellularPlanModification": true,
//                 "allowChat": true,
//                 "allowCloudBackup": true,
//                 "allowCloudDocumentSync": true,
//                 "allowCloudPhotoLibrary": true,
//                 "allowDefinitionLookup": true,
//                 "allowDeviceNameModification": true,
//                 "allowDictation": true,
//                 "allowEnablingRestrictions": true,
//                 "allowEnterpriseAppTrust": true,
//                 "allowEnterpriseBookBackup": true,
//                 "allowEnterpriseBookMetadataSync": true,
//                 "allowEraseContentAndSettings": true,
//                 "allowExplicitContent": true,
//                 "allowFingerprintForUnlock": true,
//                 "allowFingerprintModification": true,
//                 "allowGameCenter": true,
//                 "allowGlobalBackgroundFetchWhenRoaming": true,
//                 "allowInAppPurchases": true,
//                 "allowKeyboardShortcuts": true,
//                 "allowManagedAppsCloudSync": true,
//                 "allowMultiplayerGaming": true,
//                 "allowMusicService": true,
//                 "allowNews": true,
//                 "allowNotificationsModification": true,
//                 "allowOpenFromManagedToUnmanaged": false,
//                 "allowOpenFromUnmanagedToManaged": true,
//                 "allowPairedWatch": true,
//                 "allowPassbookWhileLocked": true,
//                 "allowPasscodeModification": true,
//                 "allowPhotoStream": true,
//                 "allowPredictiveKeyboard": true,
//                 "allowProximitySetupToNewDevice": true,
//                 "allowRadioService": true,
//                 "allowRemoteAppPairing": true,
//                 "allowRemoteScreenObservation": true,
//                 "allowSafari": true,
//                 "allowScreenShot": req.body.screeshot ,
//                 "allowSharedStream": true,
//                 "allowSpellCheck": true,
//                 "allowSpotlightInternetResults": true,
//                 "allowSystemAppRemoval": true,
//                 "allowUIAppInstallation": true,
//                 "allowUIConfigurationProfileInstallation": true,
//                 "allowUntrustedTLSPrompt": true,
//                 "allowVPNCreation": true,
//                 "allowVideoConferencing": true,
//                 "allowVoiceDialing": req.body.voicedialing ,
//                 "allowWallpaperModification": true,
//                 "allowiTunes": true,
//                 "forceAirDropUnmanaged": false,
//                 "forceAirPrintTrustedTLSRequirement": false,
//                 "forceAssistantProfanityFilter": false,
//                 "forceAuthenticationBeforeAutoFill": true,
//                 "forceClassroomAutomaticallyJoinClasses": false,
//                 "forceClassroomUnpromptedAppAndDeviceLock": false,
//                 "forceClassroomUnpromptedScreenObservation": false,
//                 "forceEncryptedBackup": false,
//                 "forceITunesStorePasswordEntry": false,
//                 "forceWatchWristDetection": false,
//                 "forceWiFiWhitelisting": false,
//                 "ratingApps": 1000,
//                 "ratingMovies": 1000,
//                 "ratingRegion": "us",
//                 "ratingTVShows": 1000,
//                 "safariAcceptCookies": 2,
//                 "safariAllowAutoFill": true,
//                 "safariAllowJavaScript": true,
//                 "safariAllowPopups": true,
//                 "safariForceFraudWarning": false,
//                 "whitelistedAppBundleIDs": [
//                     "com.meem.cable"
//                 ]
//             }
//     }

//     console.log("Restrictions Json: " + JSON.stringify(restrictionsJson));

//     Profile.setRestrictionProfile(tokenID, restrctionProfileName, restrictionsJson)

//     res.sendStatus(200);

// }