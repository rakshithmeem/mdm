var appRoot = require('app-root-path');
var winston = require('winston');
var fs = require('fs');

// define the custom settings for each transport (file, console)
var options = {
  file: {
    level: 'info',
    filename: `${appRoot}/config/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};


//logger.info("writing here !");
//module.exports = logger;
// exports.setFilename = function(filefullpathName){
//   fileName = filefullpathName;
// };

module.exports.getLogger = function(hash){
  if(hash != null) {
    var logPath = global.__basedir + process.env.ADMIN_ACC_PATH + hash + "/logs";
    if (!fs.existsSync(logPath)) {
        fs.mkdirSync(logPath);
    }

    options.file.filename = logPath+"/app.log";
  }
  
// instantiate a new Winston Logger with the settings defined above
var logger = new winston.Logger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console)

  ],
  exitOnError: false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function(message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  },

};

return logger;

};