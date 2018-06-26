
var plist = require('plist');
var fs = require('fs');
var constants = require('utils/constants');
var path = require('path');

exports.sendManifest = function (req, res) {

  console.log("Request, Sending Manifest!");

  var manifestPath = __dirname + '/manifest.plist';

  var ipaUrl;
  var image57Url;
  var image512Url;


  if (constants.MICROSOFT_AZURE) {
    ipaUrl = constants.AZURE.SERVERURL + "/meem/mdm/apple/managedapp/meem.ipa";
    image57Url = constants.AZURE.SERVERURL + "/meem/mdm/apple/managedapp/images/image57.png";
    image512Url = constants.AZURE.SERVERURL + "/meem/mdm/apple/managedapp/images/image512.png";
  } else if (constants.LOCAL_SERVER) {
    ipaUrl = constants.LOCAL.SERVERURL + "/meem/mdm/apple/managedapp/meem.ipa";
    image57Url = constants.LOCAL.SERVERURL + "/meem/mdm/apple/managedapp/images/image57.png";
    image512Url = constants.LOCAL.SERVERURL + "/meem/mdm/apple/managedapp/images/image512.png";
  }


  var myManifestObj = {
    "items": [
      {
        "assets": [
          {
            "kind": "software-package",
            "url": ipaUrl
          },
          {
            "kind": "display-image",
            "url": image57Url
          },
          {
            "kind": "full-size-image",
            "url": image512Url
          }
        ],
        "metadata": {
          "bundle-identifier": "com.meemgdpr.mdm",
          "bundle-version": "1.0",
          "kind": "software",
          "title": "MEEM-Managed"
        }
      }
    ]
  }


  fs.writeFile(manifestPath, plist.build(myManifestObj), function (err) {
    if (err) {
      return console.log(err);
    }

    var myObj = plist.parse(fs.readFileSync(manifestPath, 'utf8'));
    // console.log("Manifest: " + JSON.stringify(myObj));
    // console.log("Manifest file Created!");
    res.download(manifestPath);
  });


}

exports.sendManagedApp = function (req, res) {

  console.log("Request, Sending App!");
  var file = __dirname + '/meem.ipa';
  res.download(file); // Set disposition and send it.
}

exports.sendImage57 = function (req, res) {

  console.log("Sending Image 57!");
  var file = __dirname + '/images/image57.png';
  res.download(file); // Set disposition and send it.
}

exports.sendImage512 = function (req, res) {

  console.log("Sending Image 512!");
  var file = __dirname + '/images/image512.png';
  res.download(file); // Set disposition and send it.
}
