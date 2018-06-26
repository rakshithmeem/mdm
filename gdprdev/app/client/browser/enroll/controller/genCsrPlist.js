


var exec = require('child_process').exec;
var utils = require('util');
var constants = require('utils/constants')

var cmd_set_randfile = "set RANDFILE=.rnd";
var onFinish;
var curlprogresssupress = "$ProgressPreference = \"SilentlyContinue\"";

var cmd_gen_pus_csr ;
//Generate private key
var cmd_gen_private_key;
//Convert CSR to DER format
var cmd_csr_to_der ;
//convert file to base 64 string
var cmd_pushcsr_to_base64;
//extarct siganature
var cmd_signature ;
//convert file to base 64 string
var cmd_signature_to_base64;

//downlaod apple certificate and convert it to pem format    
var cmd_download_apple_wwdrc ;
var cmd_download_apple_root ; 
//convert apple certificates
var cmd_apple_wwdrca ;
var cmd_apple_root ;

var baseDir;



function prepareCommands(email , countrycode){
    var sub = "/emailAddress=" + email + "/C=" + countrycode ;
    var temp_path = baseDir+"/temp-files/"
    var mdm_vendor_cer_path  = global.__basedir+"/vendor/certs/mdm-vendor-certs/"

    if(constants.MICROSOFT_AZURE){
        
        var openSSLBin = global.__basedir + "/OpenSSL/bin/openssl";
        var openSSLConf = global.__basedir + "/OpenSSL/bin/openssl.cnf";
        //create private key 2048 bit 
        cmd_gen_pus_csr = utils.format("powershell %s req -config %s -new -sha256 -key %spushcer.key -out %spush.csr -subj '%s'",
        openSSLBin,openSSLConf,temp_path,temp_path,sub);
        //Generate private key
        cmd_gen_private_key =  utils.format("powershell %s genrsa -out %spushcer.key 2048",openSSLBin,temp_path);
        //Convert CSR to DER format
        cmd_csr_to_der = utils.format("powershell %s req -inform pem -outform der -in %spush.csr -out %spush.der -config %s",openSSLBin,temp_path,temp_path,openSSLConf);
        //convert file to base 64 string
        cmd_pushcsr_to_base64 =  utils.format("powershell %s base64 -in %spush.der -out %spushbase64.txt",openSSLBin,temp_path,temp_path);
        //extarct siganature
        cmd_signature = utils.format("powershell %s sha1 -sign %sprivate.key -out %ssigned_output.rsa  %spush.der",openSSLBin,mdm_vendor_cer_path,temp_path,temp_path);
        //convert file to base 64 string
        cmd_signature_to_base64 = utils.format("powershell %s  base64 -in %ssigned_output.rsa -out %ssigned_output.txt",openSSLBin,temp_path,temp_path);
        
        

        //TODO : should download everytime 

        //downlaod apple certificate and convert it to pem format    
        cmd_download_apple_wwdrc = "powershell curl -o ./GenPushCsr/appleRootCer/AppleWWDRCA.cer 'https://developer.apple.com/certificationauthority/AppleWWDRCA.cer'"
        cmd_download_apple_root = "powershell curl -o ./GenPushCsr/appleRootCer/AppleIncRootCertificate.cer 'http://www.apple.com/appleca/AppleIncRootCertificate.cer'"
        
        //convert apple certificates
        cmd_apple_wwdrca = "powershell ./OpenSSL/bin/openssl x509 -inform der -in ./GenPushCsr/appleRootCer/AppleWWDRCA.cer -out ./GenPushCsr/appleRootCer/AppleWWDRCA.pem"
        cmd_apple_root = "powershell ./OpenSSL/bin/openssl x509 -inform der -in ./GenPushCsr/appleRootCer/AppleIncRootCertificate.cer -out ./GenPushCsr/appleRootCer/AppleIncRootCertificate.pem"
    }else if(constants.LOCAL_SERVER){


        //create private key 2048 bit 
        cmd_gen_pus_csr = utils.format("openssl req  -new -sha256 -key %spushcer.key -out %spush.csr -subj '%s'",
        temp_path,temp_path,sub);
        //Generate private key
        cmd_gen_private_key =  utils.format("openssl genrsa -out %spushcer.key 2048",temp_path);
        //Convert CSR to DER format
        cmd_csr_to_der = utils.format("openssl req -inform pem -outform der -in %spush.csr -out %spush.der",temp_path,temp_path);
        //convert file to base 64 string
        cmd_pushcsr_to_base64 =  utils.format("openssl base64 -in %spush.der -out %spushbase64.txt",temp_path,temp_path);
        //extarct siganature
        cmd_signature = utils.format("openssl sha1 -sign %sprivate.key -out %ssigned_output.rsa  %spush.der",mdm_vendor_cer_path,temp_path,temp_path);
        //convert file to base 64 string
        cmd_signature_to_base64 = utils.format("openssl  base64 -in %ssigned_output.rsa -out %ssigned_output.txt",temp_path,temp_path);
        
        

        //TODO : should download everytime 

        //downlaod apple certificate and convert it to pem format    
        cmd_download_apple_wwdrc = "openssl curl -o ./GenPushCsr/appleRootCer/AppleWWDRCA.cer 'https://developer.apple.com/certificationauthority/AppleWWDRCA.cer'"
        cmd_download_apple_root = "openssl curl -o ./GenPushCsr/appleRootCer/AppleIncRootCertificate.cer 'http://www.apple.com/appleca/AppleIncRootCertificate.cer'"
        
        //convert apple certificates
        cmd_apple_wwdrca = "openssl x509 -inform der -in ./GenPushCsr/appleRootCer/AppleWWDRCA.cer -out ./GenPushCsr/appleRootCer/AppleWWDRCA.pem"
        cmd_apple_root = "openssl  x509 -inform der -in ./GenPushCsr/appleRootCer/AppleIncRootCertificate.cer -out ./GenPushCsr/appleRootCer/AppleIncRootCertificate.pem"

    }
}


function makeDirs(baseDir){
    var fs = require('fs');
    if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir);
    }
    if (!fs.existsSync(baseDir+"/csr-file-to-upload")) {
        fs.mkdirSync(baseDir+"/csr-file-to-upload");
    }
    if (!fs.existsSync(baseDir+"/temp-files")) {
        fs.mkdirSync(baseDir+"/temp-files");
    }
    if (!fs.existsSync(baseDir+"/uploads")) {
        fs.mkdirSync(baseDir+"/uploads");
    }
    
}



function genRandFileCB(error, stdout, stderr) {
    if (error) {
        console.log("genRandfile err", error);
        onFinish(false);
    } {
        // execute gen push csr cmd 
        exec(cmd_gen_private_key, genPrivatekeyCB);
    }
}

function genPrivatekeyCB(error, stdout, stderr) {
    if (error) {
        console.log("genPrivatekeyCB err", error);
        onFinish(false);
    } {
        // execute gen push csr cmd 
        exec(cmd_gen_pus_csr, cmd_gen_push_csr_callback);
    }
}

//gen push.csr  callback
function cmd_gen_push_csr_callback(error, stdout, stderr) {
    if (error) {
        console.log("cmd_gen_push_csr_callback err", error);        
        onFinish(false);
    } else {
        exec(cmd_csr_to_der, cmd_csr_to_der_callback);
    }
}
//push.cer tp push.der callback
function cmd_csr_to_der_callback(error, stdout, stderr) {
    if (error) {
        console.log("cmd_csr_to_der_callback err", error);
        onFinish(false);
    } else {
        exec(cmd_pushcsr_to_base64, cmd_pushcsr_to_base64_callback);
    }
}
//convert push.der to base65 
function cmd_pushcsr_to_base64_callback(error, stdout, stderr) {
    if (error) {
        console.log("cmd_csr_to_der_callback err", error);
        onFinish(false);
    } else {
        exec(cmd_signature, cmd_signature_callback);
    }
}
function cmd_signature_callback(error, stdout, stderr) {
    if (error) {
        console.log("cmd_csr_to_der_callback err", error);
        onFinish(false);
    } else {
        //exec(cmd_signature_to_base64, cmd_signature_to_base64_callback);
        exec(cmd_signature_to_base64, cmd_apple_root_callback);
    }
}
function cmd_signature_to_base64_callback(error, stdout, stderr) {
    if (error) {
        console.log("cmd_csr_to_der_callback err", error);
        onFinish(false);
    } else {
        exec(cmd_download_apple_wwdrc, cmd_download_apple_wwdrc_callback);

    }
}

//downlaod apple certificate and convert it to pem format    
function cmd_download_apple_wwdrc_callback(error, stdout, stderr) {
    if (error) {
        console.log("cmd_download_apple_wwdrc_callback err", error);
        onFinish(false);
    } else {
        exec(cmd_download_apple_root, cmd_download_apple_root_callback);
    }
}

function cmd_download_apple_root_callback(error, stdout, stderr) {
    if (error) {
        console.log("cmd_download_apple_root_callback err", error);
        onFinish(false);
    } else {
        exec(cmd_apple_wwdrca, cmd_apple_wwdrca_callback);
    }
}


function cmd_apple_wwdrca_callback(error, stdout, stderr) {
    if (error) {
        console.log("cmd_apple_wwdrca_callback err", error);
        onFinish(false);
    } else {
        exec(cmd_apple_root, cmd_apple_root_callback);
    }
}
function cmd_apple_root_callback(error, stdout, stderr) {
    if (error) {
        console.log("cmd_apple_root_callback err", error);
        onFinish(false);
    } else {
        console.log("---- All intermediate files are ready ---- ");
        startPrepaingPushCsr();
    }
}

function startPrepaingPushCsr() {
    console.log('-----   creating push csr plist   --------');

    var plist = require('plist');
    var fs = require('fs');

    var mdm_vendor_cer_path  = global.__basedir+"/vendor/certs/mdm-vendor-certs/"
    var apple_cer_path  = global.__basedir+"/vendor/certs/appleRootCer/"
    var temp_path = baseDir+"/temp-files/"
    var pushcsr_path = baseDir+"/csr-file-to-upload/"

    var mdmdata = fs.readFileSync( mdm_vendor_cer_path+'mdm.pem', "utf8");
    var applewwdcrca = fs.readFileSync(apple_cer_path+'AppleWWDRCA.pem', "utf8");
    var applerootca = fs.readFileSync(apple_cer_path+'AppleIncRootCertificate.pem', "utf8");
    var pushcsrbase64 = fs.readFileSync(temp_path+'pushbase64.txt', "utf8");
    var signrsabase64 = fs.readFileSync(temp_path+'signed_output.txt', "utf8");
    var json = {
        "PushCertCertificateChain": mdmdata + applewwdcrca + applerootca,
        "PushCertRequestCSR": pushcsrbase64,
        "PushCertSignature": signrsabase64
    };
    fs.writeFileSync(pushcsr_path+'applepush.csr', Buffer.from(plist.build(json)).toString('base64'))

    var privatekey_buff = fs.readFileSync(temp_path+'pushcer.key');
    fs.writeFileSync(pushcsr_path+'PushCert.key', privatekey_buff);
    console.log('-------------  completed  ----------------');
    onFinish(true);
}   

//callback chian to generate applepush.csr
exports.entrypoint = function (email,countrycode,hash,cb){
    console.log("---------- start preparing files ----------");
    onFinish = cb;
    baseDir = global.__basedir + process.env.ADMIN_ACC_PATH + hash;
    makeDirs(baseDir);

    prepareCommands(email,countrycode);
    
    console.log(cmd_gen_pus_csr);
    exec(cmd_set_randfile, genRandFileCB);
}


