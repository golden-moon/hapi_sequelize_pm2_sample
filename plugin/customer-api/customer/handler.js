const Boom = require('@hapi/boom');
const {createCustomers} = require('./repository');
const customerError = require('../error/error');

const customerHandler = async (request, h) => {
    try {
        const data = request.payload;
        if (data.firstName || data.lastName) {
            const result = await createCustomers(data, request.db);
            if (!result) throw new Error(JSON.stringify(customerError.CREATE_ERROR));

            return h.response({customerId: result}).code(201);
        }
        throw new Error(JSON.stringify(customerError.CREATE_ERROR));
    } catch (error) {
        console.log('Failed creating customer', error);
        const message = error instanceof Error ? error.message : error;
        throw Boom.badRequest(message);
    }
};

module.exports = {
    customerHandler
};
