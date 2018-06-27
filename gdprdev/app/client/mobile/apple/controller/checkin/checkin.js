require('rootpath')();
var fs = require('fs');
var plist = require('plist');
var device = require('app/model/api/device');
var Utils = require('utils/utility')

/** This function Handles the mdm Checkin requests from Remotely Managed Device*/

exports.ProcessDeviceChekinCommands = function (req, res) {

    if (!req.body) return res.sendStatus(406)

    console.log("process Checkin Command!"+ req.body);

    var json = plist.parse(req.body);
    console.log("json " + json);
    if ("Authenticate" == json.MessageType) {
        console.log("in Authenticate update");

        // fs.writeFile('tmp/Authenticate.plist', req.body, function (err) {
        //     if (err) {
        //         return console.log(err);
        //     }
        //     console.log("Authenticate file saved!");
        // });
        device.saveAuthenticationDetail(req.query.id, json, function(){
            res.end();
        })

    } else if ("TokenUpdate" == json.MessageType) {
        console.log("in TokenUpdate ");
        // fs.writeFile('tmp/TokenUpdate.plist', req.body, function (err) {
        //     if (err) {
        //         return console.log(err);
        //     }
        //     console.log("Authenticate file saved!");
        // });
        device.saveTokenUpdate(req.query.id, json, function(){
            res.end();
        })

    } else if(json.MessageType == "CheckOut"){

        device.deleteDeviceEntry(json.UDID).then(function(){
            console.log('Data entry is deleted')
            res.end();
        }).catch(function(){
            console.log('Error while removing data enrty');
            res.end();
        })
    }
    //res.end();


    // var string = JSON.stringify(req.body);
    // var myObj = JSON.parse(string);

    // var keys = myObj["plist"]["dict"]["key"];
    // var strings = myObj["plist"]["dict"]["string"];

    // for (var key in strings) {

    //     var MessageType = strings[key];

    //     if (MessageType == "Authenticate") {

    //         fs.writeFile('tmp/Authenticate.plist', plist.build(myObj), function (err) {
    //             if (err) {
    //                 return console.log(err);
    //             }
    //             console.log("Authenticate file saved!");
    //         });

    //         Utils.parseCheckinCommandAuthDetail(myObj, function (checkinObj) {
    //             console.log("Received Device Authentication Message!");
    //             console.log("Device Authentication Data:" + JSON.stringify(checkinObj));

    //             device.saveAuthenticationDetail(req.query.id, checkinObj);



    //         });


    //     }
    //     if (MessageType == "TokenUpdate") {

    //         fs.writeFile('tmp/TokenUpdate.plist', plist.build(myObj), function (err) {
    //             if (err) {
    //                 return console.log(err);
    //             }
    //             console.log("Authenticate file saved!");
    //         });

    //         Utils.parseCheckinCommandTokenUpdate(myObj, function (checkinObj) {

    //             console.log("Received Device TokenUpdate");
    //             console.log("Device Token Update Data:" + JSON.stringify(checkinObj));

    //             device.saveTokenUpdate(req.query.id, checkinObj);

    //         });

    //     }
    // }

  //  res.end();

};


