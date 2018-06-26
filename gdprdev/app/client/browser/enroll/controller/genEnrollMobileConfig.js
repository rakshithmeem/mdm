require('rootpath')();
var exec = require('child_process').exec;
var userid;
var utils = require('util');
var certificate = require('app/model/api/certificate');
var authentication = require('app/model/api/authentication');
var fs = require('fs');

var constants = require('utils/constants')

var identityCerPath = global.__basedir + process.env.CER_IDENTITY_PATH + "identity.p12";
var serverCrtPath = global.__basedir + process.env.CER_SSL_PATH + "Server.crt";
var serverKeyPath = global.__basedir + process.env.CER_SSL_PATH + "Server.key";
var caCrtPath = global.__basedir + process.env.CER_SSL_PATH + "CA.crt";

var cmd_sign_mobileconfig, cmd_get_uid;

//TODO: paths to defined
var baseDir;
var apnscerPath ;
var enrollmobileconfigPath ;
var signedenrollmobileconfigPath ;

var onFinish;
var tokenID;
var emailHash;

function makeDirs(baseDir){
    var fs = require('fs');
    if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir);
    }
    if (!fs.existsSync(baseDir+"/uploads")) {
        fs.mkdirSync(baseDir+"/uploads");
    }
    if (!fs.existsSync(baseDir+"/plists")) {
        fs.mkdirSync(baseDir+"/plists");
    }
    if (!fs.existsSync(baseDir+"/plists/enroll")) {
        fs.mkdirSync(baseDir+"/plists/enroll");
    }
    
}

exports.entrypoint = function (token, hash, cb) {

    console.log("entrypoint genEnroll Mobile config");
    tokenID = token;
    emailHash = hash;
    baseDir = global.__basedir + process.env.ADMIN_ACC_PATH + hash;
    makeDirs(baseDir);
    var openSSLBin = global.__basedir + "/OpenSSL/bin/openssl";

    apnscerPath = baseDir+"/uploads/PushCert.pem";
    enrollmobileconfigPath = baseDir+"/plists/enroll/UnsignedEnroll.mobileconfig";
    signedenrollmobileconfigPath = baseDir+"/plists/enroll/Enroll.mobileconfig";

    if (constants.MICROSOFT_AZURE) {
        cmd_sign_mobileconfig = utils.format("powershell %s smime -sign -in %s -out %s -signer %s -inkey %s -certfile %s -outform der -nodetach",
        openSSLBin,enrollmobileconfigPath, signedenrollmobileconfigPath, serverCrtPath, serverKeyPath, caCrtPath);
        cmd_get_uid = utils.format("powershell %s x509 -noout -subject -in %s",openSSLBin, apnscerPath);
    }else if(constants.LOCAL_SERVER){
        cmd_sign_mobileconfig = utils.format("openssl smime -sign -in %s -out %s -signer %s -inkey %s -certfile %s -outform der -nodetach",
        enrollmobileconfigPath, signedenrollmobileconfigPath, serverCrtPath, serverKeyPath, caCrtPath);
        cmd_get_uid = utils.format("openssl x509 -noout -subject -in %s", apnscerPath);
    }

    console.log(token);
    tokenID = token;
    console.log('-----   preparing push csr and enroll mobileconfig / plist   --------');
    //create private key 2048 bit 
    onFinish = cb;
    console.log("print cmd", cmd_get_uid);
    exec(cmd_get_uid, getuidfromApnsCer);
}

function getuidfromApnsCer(error, stdout, stderr) {
    if (error) {
        console.log("genPrivatekeyCB err", error);
    } else {
        if (stdout.length > 0) {
            // start prepareing mobileconfig
            var r = new RegExp('/UID=(.*)/CN=');
            var index = stdout.indexOf("com.apple.mgmt.External.");
            console.log("Index ", index);
            userid = stdout.slice(index, index + 60);
            // var uid = stdout.match(r);
            console.log("userid ", stdout);
            console.log("uid ", userid);
            gen_enroll_mobileconfig();
        } else {
            console.log("error in user id length");
            onFinish(false);
        }
    }
}

function signEnrollMobileConfig(error, stdout, stderr) {
    if (error) {
        console.log("signEnrollMobileConfig err", error);
        onFinish(false);
    } else {
        //signed mobileconfig
        console.log("token ID ",tokenID);
            certificate.addMobileConfig(emailHash, fs.readFileSync(signedenrollmobileconfigPath))
        // TODO : call enrollmobile config save to DB from reading the file signedenrollmobileconfigPath
        onFinish(true);
    }
}



function gen_enroll_mobileconfig() {
    var plist = require('plist');
    var fs = require('fs');
    const uuidv1 = require('uuid/v1');

    var identityCerUUID = uuidv1();
    var pauloadUUID_accessrights = uuidv1();
    var pauloadUUID_configuration = uuidv1();

    var serverurl ;
    var checkinurl ;
    var IdentityCerPass ;

    if(constants.MICROSOFT_AZURE){
         serverurl = constants.AZURE.SERVERURL+"/meem/mdm/apple/server?id="+emailHash;
         checkinurl = constants.AZURE.CHECKINURL+"/meem/mdm/apple/checkin?id="+emailHash;
         IdentityCerPass = constants.AZURE.IDENTITYPASSWD;
    }else if(constants.LOCAL_SERVER){
        serverurl = constants.LOCAL.SERVERURL+"/meem/mdm/apple/server?id="+emailHash;
        checkinurl = constants.LOCAL.CHECKINURL+"/meem/mdm/apple/checkin?id="+emailHash;
        IdentityCerPass = constants.LOCAL.IDENTITYPASSWD;
    }

    //cmd line args 

    var identitycer = fs.readFileSync(identityCerPath);
    var identitycer_base64 = new Buffer(identitycer).toString('ascii');

    console.log("identy path " , identityCerPath);

    var json = {
        "PayloadContent": [
            {
                "Password": IdentityCerPass,
                "PayloadCertificateFileName": "Identity.p12",
                "PayloadContent": identitycer,
                "PayloadDescription": "Adds a PKCS#12-formatted certificate",
                "PayloadDisplayName": "Identity.p12",
                "PayloadIdentifier": "com.apple.security.pkcs12." + identityCerUUID,
                "PayloadType": "com.apple.security.pkcs12",
                "PayloadUUID": identityCerUUID,
                "PayloadVersion": 1
            },
            {
                "AccessRights": 8191,
                "CheckInURL": checkinurl,
                "CheckOutWhenRemoved": false,
                "IdentityCertificateUUID": identityCerUUID,
                "PayloadDescription": "Configures MobileDeviceManagement.",
                "PayloadIdentifier": "com.apple.mdm." + pauloadUUID_accessrights,
                "PayloadOrganization": "Meem Memory Pty Ltd",
                "PayloadType": "com.apple.mdm",
                "PayloadUUID": pauloadUUID_accessrights,
                "PayloadVersion": 1,
                "ServerURL": serverurl,
                "SignMessage": false,
                "Topic": userid,
                "UseDevelopmentAPNS": false
            }
        ],
        "PayloadDisplayName": "EnrollDevice",
        "PayloadIdentifier": userid,
        "PayloadOrganization": "Meem Memory Pty Ltd",
        "PayloadRemovalDisallowed": false,
        "PayloadType": "Configuration",
        "PayloadUUID": pauloadUUID_configuration,
        "PayloadVersion": 1

    };
    fs.writeFileSync(enrollmobileconfigPath, plist.build(json));
    console.log(cmd_sign_mobileconfig);
    exec(cmd_sign_mobileconfig, signEnrollMobileConfig);

}