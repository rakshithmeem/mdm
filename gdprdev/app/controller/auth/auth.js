var express = require('express');
var app =  express();
var router =  express.Router();
var path = require('path')
var bodyParser = require('body-parser');
var deleteDB = require('app/model/api/delete');
require('rootpath')();
var winston = require('config/logconfig/winston');
var Logger = winston.getLogger(null);

var Authentication = require('app/model/api/authentication');

router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies



router.use('/login',function(req, res) {
    Logger.log('debug', "Meem Login");
    Authentication.authLogin(req,res);
});

router.use('/logout',function(req, res) {
    Logger.log('debug', "Meem Logout");
    Authentication.authLogout(req,res);
});

router.use('/register',function(req, res) {
    Logger.log('debug', "Register User");
    Authentication.authRegister(req,res);
});

router.use('/deregister',function(req, res) {
    Logger.log('debug', "Deregister User");
    deleteDB.deRegisterAdmin(req,res);

});  

router.use('/changepassword',function(req, res) {
    Logger.log('debug', "Deregister User");
    Authentication.changePassword(req,res);

}); 


module.exports = router;
