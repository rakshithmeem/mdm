var plist = require('plist');


var MDM = require('../mdmqueue');

/** This function Handles the mdm server requests from Remotely Managed Device*/

exports.ProcessDeviceServerCommands = function (req, res) {

    if (!req.body) return res.sendStatus(406)

    console.log('****server Data*******');

    var myObj = plist.parse(req.body);
  //  console.log("Json Body: " + JSON.stringify(myObj));

    if (myObj.hasOwnProperty('Status')) {

        var status = myObj['Status']
        console.log("Status: ", status);

        if(status == "Idle"){


            if (0 == MDM.Queue.length) {
                //res.sendStatus(200);
                console.log("Command Queue is empty")
                res.end();
            } else {
                console.log("Command Queue is Not empty, sending command plist")

                sendCommandPlist(req, res);
            }
        }
        else if(status == "Acknowledged"){

            console.log("Command UDID ", myObj['CommandUUID']);
            console.log("MDM DATA: " + JSON.stringify(myObj));
    
            if(myObj.hasOwnProperty('ManagedApplicationFeedback')){
                var feedback = myObj['ManagedApplicationFeedback'];
                var deviceId = myObj['UDID'];

                feedback.forEach(function(fb){
                    fb.Feedback.filetracker.forEach(function(ft){
                        device.saveFileEntry(deviceId, ft);
                    })
                })
            }
            if (0 == MDM.Queue.length) {

                console.log("Command Queue is empty")
                res.end();
            }
            else {
                console.log("Command Queue is not empty")
                res.sendStatus(200);
            }
        }
        else if(status == "Error"){
            console.log("Error: " + JSON.stringify(myObj));
            res.end();

        }
        else{

            res.end();
        }

    }else{

        console.log("UNKNOWN DATA: " + JSON.stringify(myObj));

    }

};

function sendCommandPlist(req, res) {

    if (0 != MDM.Queue.length) {
        var commandData = MDM.Queue.shift();
        // console.log("commandData: "+commandData);
        res.write(commandData);
        res.end();
    }

}