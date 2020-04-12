'use strict';

const path = require('path'),
    winston = require('winston');

//The default logger is accessible through the winston module directly. Any method that you
// could call on an instance of a logger is available on the default logger.
// This overrides default logging for logs to rotate file using winston daily rotate file by each day/hour

const createLogger = function(options) {
    const rotateFileName = path.join(options.logPath, options.logFilePattern);
    return winston.createLogger({
        levels: options.levels, // custom log levels: FATAL/ERROR/WARN/INFO/DEBUG/TRACE
        transports: [
            new (winston.transports.Console)({
                colorize: true,
                level: options.consoleMaxLogLevel // includes it and everything below it as defined in options.levels
            }),
            new (require('winston-daily-rotate-file'))({
                filename: rotateFileName ,
                datePattern: options.pattern,
                maxFiles: 2,
                level: options.fileMaxLogLevel
            })
        ]
    });
};
exports.createLogger = createLogger;

exports.register = function(server,options) {
    const logger = createLogger(options);
    server.decorate('server', 'logger', logger);
};
exports.name="log";
exports.pkg = require('./package.json');