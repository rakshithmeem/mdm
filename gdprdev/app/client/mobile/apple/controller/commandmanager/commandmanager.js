
var NotifyAPNS = require('./commands/notify');
var DeviceLock = require('./commands/devicelock')
var DeviceInfo = require('./commands/deviceinfo')
var InstallApp = require('./commands/installapp')
var RemoveApp = require('./commands/removeapp')
var ManagedAppConfig = require('./commands/managedappconfig')
var ManagedAppFeedback = require('./commands/managedappfeedback')

var CertificateList = require('./commands/certificateslist')
var ProvisioningProfileList = require('./commands/provisioningprofilelist')
var InstalledApplicationList = require('./commands/installedapplicationlist')
var ManagedApplicationList = require('./commands/managedapplicationlist')
var ProfileList = require('./commands/profilelist')
var ProvisioningProfileList = require('./commands/provisioningprofilelist')
var Restrictions = require('./commands/restrictions')
var SecurityInfo = require('./commands/securityinfo')


var MDM = require('../mdmqueue');
require('rootpath')();



/** This function Handles Commands send by Admin to Remotely Managed Device and queued.
 * This commands are send as response to idle status from device as the device wakes up.
*/

exports.ManageCommands = function (req, res) {

    if (!req.body) return res.sendStatus(406)

    console.log('Manage Device Commands');


    var tokenID = req.body.tokenID;
    var mycommand = req.body.command;


    if (mycommand == "deviceinfo") {
        var deviceinfo = new DeviceInfo(req, res);
        deviceinfo.push();

    } else if (mycommand == "devicelock") {
        var devicelock = new DeviceLock(req, res);
        devicelock.push();

    } else if (mycommand == "installmyapplication") {
        var installapp = new InstallApp(req, res);
        installapp.push();

    } else if (mycommand == "removeapplication") {
        var removeapp = new RemoveApp(req, res);
        removeapp.push();
    }
    // else if (mycommand == "setmanagedappconfig") {
    //     var config = {
    //         "fileaction": [
    //             {
    //                 "fileID": 3767,
    //                 "fileDelete": true
    //             }
    //         ]
    //     }
    //     var setmanagedappconfig = new ManagedAppConfig(req, res,config);
    //     setmanagedappconfig.push();
    // }
    else if (mycommand == "getmanagedappfeedback") {
        var getmanagedappfeedback = new ManagedAppFeedback(req, res);
        getmanagedappfeedback.push();
    }
    else if (mycommand == "certificatelist") {
        var getcertificatelist = new CertificateList(req, res);
        getcertificatelist.push();
    }
    else if (mycommand == "provisioningprofilelist") {
        var getprovisioningprofilelist = new ProvisioningProfileList(req, res);
        getprovisioningprofilelist.push();
    }
    else if (mycommand == "installedapplicationlist") {
        var getinstalledapplicationlist = new InstalledApplicationList(req, res);
        getinstalledapplicationlist.push();
    }
    else if (mycommand == "managedapplicationlist") {
        var getmanagedapplicationlist = new ManagedApplicationList(req, res);
        getmanagedapplicationlist.push();
    }
    else if (mycommand == "profilelist") {
        var getprofilelist = new ProfileList(req, res);
        getprofilelist.push();
    }
    else if (mycommand == "provisioningprofilelist") {
        var getprovisioningprofilelist = new ProvisioningProfileList(req, res);
        getprovisioningprofilelist.push();
    }
    else if (mycommand == "restrictions") {
        var getrestrictions = new Restrictions(req, res);
        getrestrictions.push();
    }
    else if (mycommand == "securityinfo") {
        var getsecurityinfo = new SecurityInfo(req, res);
        getsecurityinfo.push();
    }


    NotifyAPNS.notify(req,res);
    res.end();
};
