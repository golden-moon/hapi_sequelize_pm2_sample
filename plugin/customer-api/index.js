'use strict';
const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const CreateCustomerRouter = require('./customer/route');
/**
 * The after function contains all the code for this plugin. It is called after all
 * dependencies have been loaded into the server.
 *
 * Look further down at export.register to see how it hangs together
 *
 * @param server
 * @param next
 */
const after = function (server) {

    const routes = [];
    routes.push(CreateCustomerRouter.router(server));

    server.route(routes);
};

/**
 * Registers the customer api Plugin with the HAPI Server
 * @param server
 * @param options
 */
exports.register = function (server) {
    // Check if the database plugin is loaded
    server.dependency(['log', 'database'], after);
    server.expose('version', require('./package.json').version);

};


/**
 * Attributes to attach to the plugin
 */
exports.pkg = require('./package.json');