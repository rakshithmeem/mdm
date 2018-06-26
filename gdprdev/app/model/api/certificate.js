require('rootpath')();
var mongoose = require('mongoose')
var Certificate = require('app/model/schema/certDB');

// module.exports.addCertEmail = function(email) {
//     var crt = new Certificate();

//     console.log('Here in addCertEmail');
//     crt.addKeyEmail(email);
//     console.log('Here in addCertEmail');

//     crt.save(function(err){
//         if(err)
//             console.log('Error while saving the email key')
//         else
//             console.log('Email is successfully stored')
//     });
// }

module.exports.saveAPNCert = function (tokenId, apnKey, apnCert, onfinish) {

    console.log('333')

    authentication.fetchIdByTokenId(tokenId, function (Id) {

        console.log('111')
        var cert = new Certificate({
            'admin': Id,
            'apnCert': apnCert,
            'apnKey': apnKey
        });
        console.log('APN cert is'+apnCert)

        cert.save(function (err) {
            if (err)
                console.log('Error while saving the APN cert')
            else
                console.log('APN is successfully stored')
            onfinish();
        });
    })
}

module.exports.addMobileConfig = function (hash, mobileconfig) {

    authentication.fetchIdByHash(hash, function (Id) {
        Certificate.findOneAndUpdate({ 'admin': Id },
            { '$set': { 'mobConfigCert': mobileconfig } },
            function (err, crt) {

                crt.save(function (err) {
                    if (err)
                        console.log('Error while saving the mobile config')
                    else
                        console.log('mobileConfig is successfully stored')
                });
            })
    })
}

module.exports.getAPNCert = function (tokenId, cb) {

    authentication.fetchIdByTokenId(tokenId, function(Id){
        Certificate.findOne({ 'admin': Id}, 'apnCert apnKey', function (err, crt) {

            if (err) {
                console.log('Error while fetching the APN cert')
            } else
                cb(crt);
        });
    })
}

module.exports.getMobConfig = function (email, cb) {

    Certificate.findOne({ adminKeyEmail: email }, 'mobConfigCert', function (err, crt) {

        if (err) {
            console.log('Error while fetching the APN cert')
        } else
            cb(crt);
    });
}

module.exports.deregisterAdmin = function (email) {
    Certificate.deleteOne({ 'adminKeyEmail': email }, function (err) {
        if (err) {
            console.log('Error in droping the Certificate details of ' + email)
        } else
            console.log('Droping Certificate detail success for ' + email)
    })
}