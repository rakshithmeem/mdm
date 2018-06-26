var express = require('express');
var exphbs = require('express-handlebars');

require('dotenv').config();
var app = express();
var path = require('path');
var fs = require('fs');
var db = require('./app/model/schema/dbconfig')
var winston = require('./config/logconfig/winston');
var log = winston.getLogger(null);

var constants = require('./utils/constants');
log.debug("Meem started");
global.__basedir = __dirname;


app.set('views',path.join(__basedir , '/template'));
app.engine('hbs' ,exphbs({ extname: '.hbs'}));
app.set('view engine', 'hbs');


/*Root*/
app.get('/', function (req, res) {
    res.sendFile(path.join(__basedir + '/static/index.html'));
});


if (constants.LOCAL_SERVER) {
    app.get('/getca', function (req, res) {
        res.download('./vendor/certs/ssl/CA.crt');
    });
}




/*Hack for Upload and Download */
require('rootpath')();
var security = require('app/security/security')
var enroll = require('app/client/browser/enroll/index')
//app.use('/meem/enrollment/applepemupload',security.validate, enroll);
app.use('/meem/enrollment/applepemupload', enroll);

var meemApp = require('app/index');
app.use('/meem', meemApp);

if (constants.MICROSOFT_AZURE) {
    console.log("connecting to http");
    var http = require('http');
    http.createServer(app).listen(process.env.PORT || 3000);
    module.exports = app;
} else if (constants.LOCAL_SERVER) {
    var key = fs.readFileSync('./vendor/certs/ssl/Server.key');
    var cert = fs.readFileSync('./vendor/certs/ssl/Server.crt');
    var ca = fs.readFileSync('./vendor/certs/ssl/CA.crt');

    var options = {
        key: key,
        cert: cert,
        ca: ca
    };
    var https = require('https');
    https.createServer(options, app).listen(8080);
    console.log('HTTPS server created')
}
