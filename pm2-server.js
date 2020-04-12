'use strict';
// PM2 really only used for running node in multiple instances (and restarting them if they fail).
//http://pm2.keymetrics.io/docs/usage/use-pm2-with-cloud-providers/#without-keymetrics

const pm2 = require('pm2');
const _ = require('underscore');
const Confidence = require('confidence');

// grab the settings for the logger plugin from the manifest file
const manifest = new Confidence.Store(require('./config/manifest.json')).get('/', {
    env: process.env.NODE_ENV
});

const instances = require("os").cpus().length;
const maxMemory =  require('os').freemem() * 0.9 / instances;

pm2.connect(function() { // can start as daemon because service will not be restarted on failure now.
    const options = _.extend({
        script    : 'pm2-server-start.js',
        name      : 'hapi_sequelize_pm2_sample',        // ----> THESE ATTRIBUTES ARE OPTIONAL:
        output    : "/dev/null", // otherwise logged to ~/.pm2 (dont want) // goes to C:\dev\null on windows...
        error     : "/dev/null",
        exec_mode : 'cluster',            // ----> https://github.com/Unitech/PM2/blob/master/ADVANCED_README.md#schema
        instances : instances,
        max_memory_restart : maxMemory,   // Auto restart if process taking more than XXmo
        autorestart: true, // overrides max_restarts & min_uptime (currently pm2 will exit leaving the surviving worker isntances running.
        env: _.extend(_.clone(process.env), _.pick(manifest.server.app, ['max_restarts','kill_timeout','listen_timeout','min_uptime']))
    }, _.pick(manifest.server.app, ['max_restarts','kill_timeout','listen_timeout','min_uptime']));
    pm2.start(options, function(err) {
        if (err) {
            pm2.disconnect();   // Disconnect from PM2
            console.error('Error while launching applications', err.stack || err);
            process.exit(1);
        }
        console.log('PM2 and application has been succesfully started');

        // Display logs in standard output
        pm2.launchBus(function(err, bus) {
            console.log('[PM2] Log streaming started');

            bus.on('log:out', function(packet) {
                console.log('[App:%s][ID:%d] %s', packet.process.name, packet.process.pm_id, packet.data);
            });

            bus.on('log:err', function(packet) {
                console.error('[App:%s][ID:%d][Err] %s', packet.process.name, packet.process.pm_id, packet.data);
            });

            bus.on('process:exception', function(packet){
                console.error('[App:%s][ID:%d][Err] Unhandled Exception: %s', packet.process.name, packet.process.pm_id, packet.data.message,
                    {
                        clientIP: null,
                        apiVersion: "1.0.0",
                        correlationId: null,
                        path: "internal",
                        payload: null,
                        errorId: packet.data.errorId || manifest.server.app.errorCodes[0].errorCode,
                        serveruri: null,
                        logPointId: __filename,
                        error: packet.data.stack,
                        loggingLevel: "FATAL"
                    });
            });

        });

    });
});