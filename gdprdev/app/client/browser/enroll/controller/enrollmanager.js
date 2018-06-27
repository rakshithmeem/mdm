require('rootpath')();
var path = require('path')
var bodyParser = require('body-parser');
var fs = require('fs');
var crypto = require('crypto');
var generatecsr = require('./genCsrPlist')
var genenrollmobileconfig = require('./genEnrollMobileConfig')

var certificate = require('app/model/api/certificate')
var authentication = require('app/model/api/authentication')
var device = require('app/model/api/device')

var winston = require('config/logconfig/winston');
var sendOtpMail = require('./sendOTPmail');


function getHash(email) {
    var hash = crypto.createHash('sha256');
    hash.update(email);
    return hash.digest('hex');
}


function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }

  function sendOTPEmailandstartTimer(obj , callback){
    sendOtpMail.sendMail(obj,function(err){
        if(err){
            console.log('error msg ' , err.message);
            callback(err);
        }else{
            callback(null);
        }
    });
  }

exports.downloadMobileConfig = function(req, res){
    var string = JSON.stringify(req.query)
    var myObj = JSON.parse(string);
    console.log(req.query);

    //TODO : check for admin ID  hash & email ID also check if otp as pin is expired or not 
    device.verifyOTP(myObj).then(function(){


        var mobileConfigPath = global.__basedir + process.env.ADMIN_ACC_PATH + myObj.id+'/plists/enroll/Enroll.mobileconfig'


        res.download(mobileConfigPath); // Set disposition and send it.
        //res.download("/Users/vignesh/MDM-workspace/meem_mdm_New/Enroll.mobileconfig"); // Set disposition and send it.
        //res.send(401,'Email-ID or OTP wrong please check again.');
        //res.sendStatus(401);
        //res.end();
    }).catch(function(err){
        res.send(401, err)
    })


}

exports.GenCsr = function (req, res) {

    if (!req.body) return res.sendStatus(406)

    var tokenID = req.body.tokenID;
    console.log('Token: ' + tokenID);

    console.log('Enroll Device');

    var string = JSON.stringify(req.body);

    console.log('Data:' + string);
    var myObj = JSON.parse(string);

    var keys = Object.keys(myObj);
    console.log('keys:' + keys);
    keys.forEach(function (item) {
        // 	console.log('objects :' + item);
        if (item == "tokenID") {
            console.log('item:' + item);

        }
        else if (item == "type") {
            console.log('item:' + item);

        } else if (item == "req") {
            console.log('item:' + item);

            var reqObj = myObj[item];
            var keys = Object.keys(reqObj);
            // console.log('Req keys:'+ keys);


            keys.forEach(function (req) {

                if (req == "name") {

                    name = reqObj[req];
                }
                else if (req == "email") {
                    email = reqObj[req];
                }
                else if (req == "countrycode") {
                    countrycode = reqObj[req];
                }


            })

            console.log('Name : ' + name);
            console.log('Email : ' + email);
            console.log('Country Code : ' + countrycode);

            if (name.length && email.length) {

                onPushcsrGeneration = function (status) {
                    if (status) {
                        console.log("******* Push csr Generated ******* ");
                        var resJson = {
                            "link": "https://idmsa.apple.com/IDMSWebAuth/login?appIdKey=3fbfc9ad8dfedeb78be1d37f6458e72adc3160d1ad5b323a9e5c5eb2f8e7e3e2&rv=2"
                        }
                        res.send(resJson);
                        res.end();

                    } else {
                        console.log("push csr generation failed");
                    }
                }

                authentication.fetchHashByTokenId(tokenID, function (hash) {

                    generatecsr.entrypoint(email, countrycode, hash, onPushcsrGeneration);
                })

            }
            else {

                if (!name.length) {
                    res.send("Name field is Empty");

                }
                else if (!email.length) {
                    res.send("Email field is Empty");

                }
                res.end();
            }
        }
    })
}

exports.ListDevices = function (req, res) {

    if (!req.body) return res.sendStatus(406)

    console.log('List Enrolled Devices');

    device.listdevices(req.query.tokenID, function (deviceList) {
        console.log('The device list is sent')

        res.status(200);
        res.send(deviceList);

    });

};

exports.EnrollDevice = function (req, res) {

    if (!req.body) return res.sendStatus(406)

    var string = JSON.stringify(req.body);
    var tokenID = req.body.tokenID;
    console.log('Data:' + string);
    var myObj = JSON.parse(string);
    console.log("%s \n%s  \n%s \n%s \n", myObj.tokenID,
        myObj.type,
        myObj.req.name,
        myObj.req.email);
        if(validateEmail(myObj.req.email)){

            myObj.otp =  Math.floor(Math.random()*90000) + 100000;
            myObj.routeId = makeid();   // dynamic route ID
            

            //TODO : store email id name , routeID , otp ,type 
            //console.log('**************'+JSON.stringify(req.body))
            device.addUser({
                'name':myObj.req.name,
                'email':myObj.req.email,
                'otp':myObj.otp,
                'routeId': myObj.routeId,
                'type' : myObj.type,
                'isOTPValid':true
            }, tokenID)

            authentication.fetchHashByTokenId(tokenID, function(hash){
                console.log("mail options" , myObj);
                myObj.hash = hash;
                sendOTPEmailandstartTimer(myObj , function(err){
                        if(err){
                            console.log("error msg" , err.message);
                            //TODO : ON expire OTP timeout Var set to false, and clear otp and roteID 
                            res.sendStatus(404);
                        }else{
                            console.log("Sent otp mail to " ,myObj.req.email  );
                            setTimeout(function(){
                                console.log("time out OTP for user " , myObj.req.email);
                                device.resetOTP(myObj.email);
                            }, 300000);
                            res.sendStatus(200);
                        }
                });
            })
        }else{
            res.sendStatus(404);
        }
};

exports.ListEnrollmentSettings = function (req, res) {

    if (!req.body) return res.sendStatus(406)

    console.log('List Enrollment settings');

    res.status(200);
    var jsonresp = { "OTP": "dummy" };
    res.send(jsonresp);

};


exports.DownloadPushCsr = function (req, res) {

    console.log("Download Unsigned push CSR!");
    var tokenID = req.query.tokenID;
    console.log('Token: ' + tokenID);

    authentication.fetchHashByTokenId(tokenID, function (hash) {

        var pushcsrpath = global.__basedir + process.env.ADMIN_ACC_PATH + hash + "/csr-file-to-upload/applepush.csr";

        if (fs.existsSync(pushcsrpath)) {

            console.log("Push Csr Exists!!")
            res.download(pushcsrpath); // Set disposition and send it.

        }
        else {
            console.log("Push Csr DOESNTExists!!")

            res.sendStatus(404)
        }
    })


};

exports.DownloadEnrollProfile = function (req, res) {

    console.log("Download Enroll Profile!");

    var tokenID = req.query.tokenID;
    console.log('Token: ' + tokenID);

    var string = JSON.stringify(req.query)
    var myObj = JSON.parse(string);
    console.log(myObj);

    authentication.fetchHashByTokenId(tokenID, function (hash) {

        var enrollconfigpath = global.__basedir + process.env.ADMIN_ACC_PATH + hash + "/plists/enroll/Enroll.mobileconfig";

        if (fs.existsSync(enrollconfigpath)) {

            console.log("Enroll Profile Exists!!")
            res.download(enrollconfigpath); // Set disposition and send it.

        }
        else {
            console.log("Enroll Profile DOESNTExists!!")

            res.sendStatus(404)
        }
    })
};

exports.DownloadCA = function (req, res) {

    console.log("Download CA Cert!");

    var string = JSON.stringify(req.query)
    var myObj = JSON.parse(string);
    console.log(myObj);
    var CACertpath = 'vendor/certs/ssl/CA.crt'

    if (fs.existsSync(CACertpath)) {

        console.log("CA Cert Exists!!")
        res.download(CACertpath); // Set disposition and send it.

    }
    else {
        console.log("CA Cert DOESNTExists!!")
        res.sendStatus(404)
    }

};


exports.onPushCsrUploadCompleted = function (req, res) {

    console.log("Push Cert Uploaded");
    var tokenID = req.body.tokenID;
    console.log('Token: ' + tokenID);

    authentication.fetchHashByTokenId(tokenID, function (hash) {

        var currUploadPath = global.__basedir + '/tmp/PushCert.pem';
        var newUploadPath = global.__basedir + process.env.ADMIN_ACC_PATH + hash + '/uploads/PushCert.pem';


        console.log("currUploadPath: " + currUploadPath);
        console.log("newUploadPath: " + newUploadPath);


        fs.createReadStream(currUploadPath).pipe(fs.createWriteStream(newUploadPath)).on('finish', function (err) {
            apnskeyPath = global.__basedir + process.env.ADMIN_ACC_PATH + hash + "/csr-file-to-upload/PushCert.key";
            apnscerPath = global.__basedir + process.env.ADMIN_ACC_PATH + hash + "/uploads/PushCert.pem";
    
            console.log("apnscerPath: " + apnscerPath);
            console.log("apnskeyPath: " + apnskeyPath);
    
            certificate.saveAPNCert(tokenID, fs.readFileSync(apnskeyPath), fs.readFileSync(currUploadPath), function () {
    
                var onEnrollMobileConfigGeneration = function (status) {
                    if (status) {
                        console.log("******* Enroll mobile config Generated ******* ");
                        res.end('File is uploaded. iOS Enroll link:http://www.codeswallop.com/meem/device/enroll')
    
                    } else {
    
                        console.log("Enroll mobile config generation failed");
                        res.end('File is uploaded, iOS Enroll generation failed')
    
                    }
                }
                genenrollmobileconfig.entrypoint(tokenID, hash, onEnrollMobileConfigGeneration);
            });
    
        })

    })

}


