const errorEvents = require('../logger/eventType');

module.exports = {
    [errorEvents.CREATE_ERROR]: {
        errorCode: 101,
        errorMessage: 'Unable to create record'
    }
};
