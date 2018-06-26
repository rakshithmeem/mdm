var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
require('rootpath')();

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
router.use(bodyParser.text({ type: "*/*" }));

var checkin =require('./controller/checkin/checkin');
var server =require('./controller/server/server');
var commands =require('./controller/commandmanager/commandmanager');
var managedapp =require('./controller/managedapp/index');
var applefilemanager =require('./controller/filemanager/index');

var plistParser = bodyParser.xml({
    limit: '1MB',   // Reject payload bigger than 1 MB 
    xmlParseOptions: {
        normalize: true,     // Trim whitespace inside text nodes 
        normalizeTags: true, // Transform tags to lowercase 
        explicitArray: false // Only put nodes in array if >1 
    }
})

router.use('/checkin',bodyParser.json(),checkin.ProcessDeviceChekinCommands);
router.use('/server',bodyParser.json(),server.ProcessDeviceServerCommands);
router.use('/managedapp',managedapp);
router.use('/filemanager', applefilemanager);

module.exports = router;