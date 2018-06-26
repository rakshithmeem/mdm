var express = require('express');
var app =  express();
var router =  express.Router();
var path = require('path')

require('rootpath')();

router.get('/sign-in', function (req, res) {
    res.sendFile(path.join(__basedir + '/static/loginuser.html'));
});

router.get('/sign-up', function (req, res) {
    res.sendFile(path.join(__basedir + '/static/registeruser.html'));
});

router.get('/enroll-form', function (req, res) {
    res.sendFile(path.join(__basedir + '/static/enrollpage.html'));
});

router.get('/enrollconfig', function (req, res) {
    res.sendFile(path.join(__basedir + '/static/mobileconfig.html'));
});

router.get('/mdm', function (req, res) {
    res.sendFile(path.join(__basedir + '/static/mdm.html'));
});
router.get('/command-list', function (req, res) {
    res.sendFile(path.join(__basedir + '/static/mdmcmd.html'));
});

router.get('/profile', function (req, res) {
    res.sendFile(path.join(__basedir + '/static/mdmprofile.html'));
});

router.get('/webshortcuts', function (req, res) {
    res.sendFile(path.join(__basedir + '/static/mdmwebshortcuts.html'));
});


module.exports = router;
