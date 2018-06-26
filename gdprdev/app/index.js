var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
require('rootpath')();

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
router.use(bodyParser.text({ type: "*/*" }));


var security = require('./security/security');
var auth = require('./controller/auth/auth');
var enroll = require('./client/browser/enroll/index');
var profiles = require('./client/browser/profiles/index');

var pageloader = require('./controller/dummyfilerequests');
var mobile = require('./client/mobile/index');


router.use('/auth', auth); //Auth module -- Requests from Browser
router.use('/mdm', mobile); //MDM module -- Requests from Mobile
router.use('/device', security.validate, mobile); //Device module -- Requests from Mobile goes through validation
router.use('/enrollment', enroll); //Enroll module -- Requests from Browser [TODO: include validation]
router.use('/profiles', security.validate, profiles); //Profile module -- Requests from Browser goes through validation
router.use('/pageloader', pageloader); //requests from Browser for HTML page loading

module.exports = router;
