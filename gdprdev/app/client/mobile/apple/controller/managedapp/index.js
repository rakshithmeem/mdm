var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
require('rootpath')();

var managed = require('./managed');

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
router.use(bodyParser.text({ type: "*/*" }));


router.use('/manifest.plist',managed.sendManifest);
router.use('/meem.ipa',managed.sendManagedApp);
router.use('/image512.png',managed.sendImage512);
router.use('/image57.png',managed.sendImage57);

module.exports = router;