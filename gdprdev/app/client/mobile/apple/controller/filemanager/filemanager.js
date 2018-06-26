var ManagedAppConfig = require('../commandmanager/commands/managedappconfig')
var NotifyAPNS = require('../commandmanager/commands/notify');


/** This function Handles File Management Commands send by Admin to Remotely Manage the files in the Managed App.
 * This commands are send as Settings Command with ApplicationConfiguration as Settings Item.
*/

module.exports.getFileList = function (req, res) {
    device.getFileEntry(req.body.deviceId).then(function (fileList) {
        res.send(fileList);
    }).catch(function (err) {
        res.send(err)
    })
}

module.exports.deleteFile = function (req, res) {
    deviceId = req.body.deviceID;
    fileList = req.body.file_list;

    var config = {
        "fileaction": {
            "filelist": fileList,
            "action": "delete"
        }
    }

    var setmanagedappconfig = new ManagedAppConfig(req, res, config);
    setmanagedappconfig.push();
    NotifyAPNS.notify(req,res);

    fileList.forEach(function (file) {
        device.deleteFileEntry(deviceId, file.fileID).catch(function (err) {
            res.send(err);
        })
    });
    res.send('Successful deletion of files!');

}

module.exports.deleteVault = function (req, res) {
    deviceId = req.body.deviceID;

    var config = {
        "vaultaction":
            {
                "action": "delete"
            }
    }
    var setmanagedappconfig = new ManagedAppConfig(req, res, config);
    setmanagedappconfig.push();
    NotifyAPNS.notify(req,res);

    device.deleteCompleateFileEntry(deviceId).then(function () {
        res.send('Successful deletion of files!');
    }).catch(function (err) {
        res.send(err);
    })
}
