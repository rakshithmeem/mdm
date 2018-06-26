var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
require('rootpath')();

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())


var profiles =require('./controller/profilemanager');
var email =require('./controller/email');
var restrictions =require('./controller/restrictions');
var passcode =require('./controller/passcode');
var wifi =require('./controller/wifi');
var webshortcuts = require('./controller/webshortcuts');
var webDomain = require('./controller/webdomain');
var certificates = require('./controller/certificates');

router.use('/create',profiles.CreateProfile);
router.use('/update',profiles.UpdateProfile);
router.use('/deploy',profiles.DeployProfile);
router.use('/delete',profiles.DeleteProfile);

router.use('/email',email.ManageEmailProfile);
router.use('/restrictions',restrictions.ManageRestrictionProfile);
router.use('/passcode',passcode.ManagePasscodeProfile);
router.use('/passcode',wifi.WifiProfile);
router.use('/webshortcuts',webshortcuts.ManageWebShortcuts);
router.use('/managedwebdomains',webDomain.ManageWebDomain);
router.use('/certificate',certificates.ManageCertificatePofile);


module.exports = router;