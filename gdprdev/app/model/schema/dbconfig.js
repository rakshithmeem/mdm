var mongoose = require('mongoose');
require('rootpath')();
var winston = require('config/logconfig/winston');
var log = winston.getLogger(null);
var gracefulShutdown;
var dbURI = 'mongodb://localhost/test';

log.debug("Mongoose DB ");
mongoose.connect(process.env.CUSTOMCONNSTR_MongolabUri
    || dbURI);
// CONNECTION EVENTS
mongoose.connection.on('connected', function() {
    log.debug("Mongoose connected");
});
mongoose.connection.on('error', function(err) {
    log.debug("Mongoose connection error: " + err);
});
mongoose.connection.on('disconnected', function() {
    log.debug("Mongoose disconnected");
});

// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
gracefulShutdown = function(msg, callback) {
    mongoose.connection.close(function() {
        log.debug("Mongoose disconnected through " + msg);
        callback();
    });
};
// For nodemon restarts
process.once('SIGUSR2', function() {
    log.debug("Mongoose graceful shutdown " + msg);
    gracefulShutdown('nodemon restart', function() {
        process.kill(process.pid, 'SIGUSR2');
    });
});
// For app termination
process.on('SIGINT', function() {
    log.debug("Mongoose terminated " + msg);
    gracefulShutdown('app termination', function() {
        process.exit(0);
    });
});
// For Heroku app termination
//process.on('SIGTERM', function() {
//  gracefulShutdown('Heroku app termination', function() {
//    process.exit(0);
//  });
//});

// BRING IN YOUR SCHEMAS & MODELS
// require('./authDB');
// require('./devicesDB');
// require('./profilesDB');


