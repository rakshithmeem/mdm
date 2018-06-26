var express = require('express');
var router = express.Router();
var multer = require('multer')
var bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
require('rootpath')();

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

var enroll = require('./controller/enrollmanager')

router.post('/enroll', enroll.EnrollDevice);
router.post('/gencsr', enroll.GenCsr);
router.get('/listdevices', enroll.ListDevices);
router.get('/settings', enroll.ListEnrollmentSettings);
router.get('/appleCSR', enroll.DownloadPushCsr);
router.get('/download-profile', enroll.DownloadEnrollProfile);
router.get('/download-CA', enroll.DownloadCA);


// router.use('/applecertificate/', applecert);

router.get('/mobileconfig', function (req, res) {
    enroll.downloadMobileConfig(req, res);
});

var crypto = require('crypto');

function getHash(email){
    var hash = crypto.createHash('sha256');
    hash.update(email);
    return hash.digest('hex');
}


var storage = multer.diskStorage({
    
    destination: function (req, file, callback) {
        callback(null,'tmp/')
    },
    filename: function (req, file, callback) {
        callback(null, "PushCert.pem")
    }
})

var upload = multer({
    storage: storage
})

router.use('/', upload.single('userFile'), function (req, res) {
    
    enroll.onPushCsrUploadCompleted(req, res);
})


module.exports = router;
