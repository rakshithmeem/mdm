var Device = require('../schema/devicesDB')
var authentication = require('../api/authentication')
let User = require('app/model/schema/authDB');

module.exports.saveAuthenticationDetail = function (hash, authDetails, cb) {

    authentication.fetchIdByHash(hash, function (Id) {

        Device.findOneAndUpdate({ "deviceId": authDetails["UDID"] }, {
            '$set': {
                "deviceId": authDetails["UDID"],
                "authentication": authDetails,
                "admin": Id
            }
        }, { upsert: true, new: true }, function (err, device) {
            device.save(function (err) {
                if (err)
                    console.log('Error while saving device entry ' + err)
                else
                    console.log('Device entry saved')
                cb();
            })
        })
    })
};

module.exports.saveTokenUpdate = function (hash, tokenUpdateArg, cb) {
    authentication.fetchIdByHash(hash, function (Id) {

        Device.findOne({ 'deviceId': tokenUpdateArg['UDID'] }, function (err, deviceObj) {

            deviceObj.tokenUpdate = tokenUpdateArg;
            deviceObj.save(function (err) {
                if (err)
                    console.log('Error while saving');
                else {
                    console.log('Token UPDATE SUCCESSFULY stored')
                    cb();
                }
            });
        })
    })
};

module.exports.listdevices = function (tokenId, cb) {

    var deviceArray = [];

    authentication.fetchIdByTokenId(tokenId, function (Id) {

        console.log(Id)
        Device.find({ 'admin': Id, deviceId: { $ne: null } }, function (err, deviceList) {

            console.log(JSON.stringify(deviceList))
            if (err)
                console.log('Error getting device list')
            else if (!deviceList) {
                console.log('NULL object')
            } else {
    
                deviceList.forEach(function (list) {
    
                    var json = {
                        "devices": {
                            "deviceid": list.deviceId,
                            "Device": {
                                "name": 'Some_dummy_name',
                                "OSversion": list.authentication.OSVersion,
                                "platform": 'IOS',
                                "buildversion": list.authentication.BuildVersion,
                                "model": list.authentication.ProductName,
                                "modelname": list.authentication.ProductName,
                                "productname": list.authentication.ProductName,
                                "udid": list.authentication.UDID,
                                "imei": list.authentication.IMEI,
                                "serialnumber": list.authentication.SerialNumber,
                                "devicecapacity": '12GB',
                                "freespace": '2GB',
                                "batterylevel": '17'
                            },
                            "Network": {
                                "bluetoothMAC": 'AB:CD:EF:AB:CD:EF',
                                "WiFiMAC": 'AB:CD:EF:AB:CD:EF',
                                "IPaddress": '192.168.0.8',
                                "WifiSSD": 'ABCDEF'
                            }
                        }
                    };
    
                    //console.log(JSON.stringify(json))
    
                    deviceArray.push(json)
                })
            }
    
            cb(deviceArray);
        })
    })
    
}

module.exports.saveFileEntry = function (deviceId, fileDetail) {

    Device.findOneAndUpdate({ 'deviceId': deviceId }, { '$push': { 'fileDetail': fileDetail } }, { upsert: true, new: true }, function (err, device) {
        console.log(deviceId + ' 111 ' + JSON.stringify(device) + err)
        device.save(function (err) {
            console.log(err)
            if (err)
                console.log('Error in saving file info ' + err)
            else
                console.log('File info saved');
        })
    })
}

module.exports.getFileEntry = function (deviceId) {

    var promise = new Promise(function (resolve, reject) {
        Device.findOne({ 'deviceId': deviceId, 'deviceId' : {$ne : null} }, 'fileDetail', function (err, fileList) {
            if (err) {
                console.log("Error while getting the file list");
                reject(err)
            } else if (!fileList)
                reject('NULL filelist!');
            else {
                resolve(fileList.fileDetail);
            }
        })
    })
    return promise;
}

module.exports.deleteDeviceEntry = function(deviceId){
    var promise = new Promise(function (resolve, reject) {

        Device.findOneAndRemove({ 'deviceId': deviceId }, function (err, device) {
            device.save(function (err) {
                if (err) {
                    console.log('Error in deleting device ' + err)
                    reject(err)
                }
                else {
                    console.log('Device deleted');
                    resolve('Device deleted');
                }
            })
        })
    })
    return promise;
}

module.exports.deleteFileEntry = function (deviceId, fileId) {

    //console.log(deviceId+' '+fileId);
    var promise = new Promise(function (resolve, reject) {
        Device.findOneAndUpdate({ 'deviceId': deviceId }, { '$pull': { 'fileDetail': { 'fileID': fileId } } }, { new: true }, function (err, device) {
            device.save(function (err) {
                if (err) {
                    console.log('Error in deleting filelist ' + err)
                    reject(err)
                }
                else {
                    console.log('Filelist deleted');
                    resolve('Filelist deleted');
                }
            })
        })
    })
    return promise;

}

module.exports.deleteCompleateFileEntry = function (deviceId) {

    var promise = new Promise(function (resolve, reject) {
        Device.findByIdAndUpdate({ 'deviceId': deviceId }, { '$pull': { 'fileDetail': {} } }, { new: true }, function (err, device) {
            device.save(function (err) {
                if (err) {
                    console.log('Error in deleting filelist ' + err)
                    reject(err)
                }
                else {
                    console.log('Filelist deleted');
                    resolve('Filelist deleted');
                }
            })
        })
    })
    return promise;
}

module.exports.setProfileId = function (deviceId, pId) {
    Device.findOneAndUpdate({ 'deviceId': deviceId }, { '$set': { 'profileId': pId } }, { new: true }, function (err, device) {
        device.save(function (err) {
            console.log(err)
            if (err)
                console.log('Error in saving profile ID ' + err)
            else
                console.log('Profile Id saved');
        })
    })
}

module.exports.resetOTP = function (email) {
    Device.findOneAndUpdate({ 'user.email': email }, {'$set':{'user.isOTPValid': false}}, { new: true }, function (err, device) {
        device.save(function (err) {
            if (err)
                console.log('Error in resetting ')
            else
                console.log('OTP reset')
        })
    })
}

module.exports.isProfileSame = function (deviceId, pId) {
    var promise = new Promise(function (resolve, reject) {
        Device.findOne({ 'deviceId': deviceId }, 'profileId', function (err, profileId) {
            if (profileId.profileId == pId || profileId.profileId == null) {
                resolve(true)
            }
            else {
                reject(true)
            }
        })
    })
    return promise;
}

module.exports.removeProfile = function (deviceId) {
    Device.findOneAndUpdate({ 'deviceId': deviceId }, { '$set': { 'profileId': null } }, { new: true }, function (err, device) {
        device.save(function (err) {
            if (err)
                console.log('Error in removeing the profile entry ' + err)
            else
                console.log('Profile entry removed');
        })
    })
}

module.exports.addUser = function (userDetail, tokenId) {
    authentication.fetchIdByTokenId(tokenId, function (Id) {
        Device.findOneAndUpdate({ "user.email": userDetail.email, "admin": Id }, {'$set': {'user': userDetail}}, 
                                {upsert: true, new: true}, function(err, device){
            device.save(function (err) {
                if (err)
                    console.log('Error in saving user detail ' + err)
                else
                    console.log('User entry saved!');
            })
        });
    })
}

module.exports.verifyOTP = function (enrollInfo) {
    var promise = new Promise(function (resolve, reject) {
        console.log(JSON.stringify(enrollInfo));

        authentication.fetchIdByHash(enrollInfo.id, function (Id) {
            Device.findOne({ 'admin': Id, 'user.email': enrollInfo.email }, 'user', function (err, userObj) {
                if (err) {
                    reject(err);
                } else if (!userObj) {
                    reject('Wrong email')
                }
                if (userObj.user.isOTPValid) {
                    if (userObj.user.otp == enrollInfo.otp) {
                        resolve('OTP Verified!')
                    } else {
                        console.log('6');
                        reject('Wrong OTP!')
                    }
                } else
                    reject('OTP timeout!')
            })
        })
    })
    return promise;
}

module.exports.getTokenByDevId = function (tokenId, devId, tokenCB) {

    // Device.find({'adminKeyEmail': email, 'deviceList.device.deviceID': devId}, 'deviceList.device.tokenUpdate.Token deviceList.device.tokenUpdate.PushMagic', function (err, token) {
    Device.findOne({ 'deviceId': devId }, function (err, token) {

        if (err) {
            console.log('Error while fetcing token')
        }
        if (token) {

            console.log("Device Token: " + JSON.stringify(token));

            //  console.log('*** '+token[0].deviceList[0].device.tokenUpdate.token+'   '+token[0].deviceList[0].device.tokenUpdate.pushMagic);
            tokenCB(token.tokenUpdate.Token, token.tokenUpdate.PushMagic);
        }
    });
}

module.exports.deregisterAdmin = function (email) {
    Device.deleteOne({ 'adminKeyEmail': email }, function (err) {
        if (err) {
            console.log('Error in droping the device details of ' + email)
        } else
            console.log('Droping device detail success for ' + email)
    })
}
