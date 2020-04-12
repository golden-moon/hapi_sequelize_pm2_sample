const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const {customerHandler} = require('./handler');

const responseSchema = {
    '201': {
        'description': 'Customer Created Successfully',
        'schema': Joi.object().keys({
            transactionId: Joi.string()
                .example('12345')
        }).label('CreateCustomerResponse')
    },
    '400': {
        'description': 'Bad Request',
        'schema': Joi.object({
            statusCode: Joi.number().example(400),
            error: Joi.string().example('Bad Request'),
            message: Joi.string()
                .example('{"errorCode":101,"errorMessage":"Unable to create record"}')
        }).label('FailToCreateCustomerResponse')
    }
};

const requestPayload = Joi.object().keys({
    firstName: Joi.string()
        .max(50)
        .example('John'),
    lastName: Joi.string()
        .max(50)
        .example('Smith')
}).or('firstName', 'lastName').label('CreateCustomerRequest')
    .options({allowUnknown: true});

exports.router = function async(server) {
    const createCustomerConfig = {
        method: 'POST',
        path: '/customer',
        handler: async (request, reply) => {
            try {
                request.db = server.database;
                request.logger = server.logger;
                return await customerHandler(request, reply);
            } catch (err) {
                server.logger.error("Error occured while creating the customer");
            }
        },
        options: {
            plugins: {
                'hapi-swagger': {
                    responses: responseSchema
                },
                payloadType: 'json',
                statusCode: 201
            },
            tags: ['api', 'Customer'],
            validate: {
                payload: requestPayload,
                // failAction needs mandatory three inputs.
                failAction: async (request, handler, error) => {
                    throw Boom.badRequest(error);
                }
            }
        }
    };

    return createCustomerConfig;
}

