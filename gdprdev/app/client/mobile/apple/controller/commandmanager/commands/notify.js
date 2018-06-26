require('rootpath')();
var authentication = require('app/model/api/authentication');
var certificate = require('app/model/api/certificate');
var device = require('app/model/api/device');
var apn = require('apn');



exports.notify = function (req, res) {

  var tokenID = req.body.tokenID;
  var deviceID = req.body.deviceID;

  console.log("notify deviceID: "+deviceID);

  device.getTokenByDevId(tokenID, deviceID, function (devicetoken, pushmagic) {

    console.log("tokenID: " + tokenID);
    console.log("deviceID: " + deviceID);
    console.log("Push Magic: " + pushmagic);

    if(devicetoken ==null){
      console.log("Device Token is null");

    }
    console.log("Notify Device Token: " + devicetoken.toString('base64'));

      certificate.getAPNCert(tokenID, function (cert) {
        console.log("cert: " + cert);


       var str = devicetoken.toString('base64');

       console.log("str: " + str);

       var hexDeviceToken = new Buffer(str, 'base64').toString('hex')

        console.log("Device Token Hex: " + hexDeviceToken);

        var note = new apn.Notification();

        let apnProvider = new apn.Provider({
          key: cert.apnKey,
          cert: cert.apnCert,
          production: true
        });

        console.log("Sending..");

        note.payload = { 'mdm': pushmagic };
        console.log("node payload..");

        apnProvider.send(note, hexDeviceToken).then((result) => {
          console.log("sent:", result.sent.length);
          console.log("failed:", result.failed.length);
          console.log(result.failed);
        });
      });
  });
}

// Base64 to Hex
function base64ToHex(str) {
  for (var i = 0, bin = atob(str.replace(/[ \r\n]+$/, "")), hex = []; i < bin.length; ++i) {
      let tmp = bin.charCodeAt(i).toString(16);
      if (tmp.length === 1) tmp = "0" + tmp;
      hex[hex.length] = tmp;
  }
  return hex.join(" ");
}
