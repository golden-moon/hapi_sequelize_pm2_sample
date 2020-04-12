'use strict';

const Confidence = require('confidence');
const Glue = require('@hapi/glue');
const _ = require('underscore');
const cluster = require('cluster');

/**
 * The manifest is the main glue configuration file that will be creating the server and loads the
 * required plugins
 * Picks up Manifest.json in the config folder
 * @type {*|value}
 */
const manifest = new Confidence.Store(require('./config/manifest.json')).get('/', {
    env: process.env.NODE_ENV
});

const options = {relativeTo: __dirname};
let serverInstance;

/**
 * This command sets up the server using the manifest and the confidence store based on the the node_env
 * environment variable
 */

const init = async () => {
    try {
        const server = await Glue.compose(manifest, options);
        await server.start();

        console.log('Server started at: http://localhost:2000/documentation');
        serverInstance = server;
        if (!cluster.isMaster) {
            process.send('ready');
            process.send('online');
        }
        return serverInstance;
    } catch (err) {
        console.error(err);
        process.exit(1); // exit if there is an error getting the connection pool up and running.
    }
};

process.on('SIGINT', function (msg) {
    if (serverInstance) {
        serverInstance.stop({timeout: manifest.server.app.kill_timeout}, function (err) {
            console.log('Server stopped');
            if (err) {
                console.error(err);
            }
            process.exit(err ? 1 : 0);
        });
    }
});

exports.initialize = async () => {
    const server = await Glue.compose(manifest, options);
    await server.initialize();
    return server;
};

exports.start = async () => {
    return await init();
};