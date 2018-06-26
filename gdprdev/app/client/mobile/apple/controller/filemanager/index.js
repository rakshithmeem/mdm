var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var filemanager = require('./filemanager')

router.use('/delete', filemanager.deleteFile);
router.use('/list', filemanager.getFileList);
router.use('/deleteVault', filemanager.deleteVault);

module.exports = router;