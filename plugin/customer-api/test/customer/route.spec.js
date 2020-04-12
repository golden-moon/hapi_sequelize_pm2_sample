const { expect } = require('chai');
const { before, after, describe, it, xit} = require('mocha');
const { initialize } = require('../../../../server');

let server;

before(async () => {
    console.log ("First statement");
    if(!server){
        console.log("Server not started");
        server = await initialize();
    }else {
        console.log("Server already started");
    }

});

after(async () => {
   // await server.stop();
});

describe('Customer API Integration Test', () => {

    describe('Create Customer', () => {

        describe('Successful scenario', () => {

            it('successfully create customer with firstName and lastName', async () => {
                const payload = {
                    firstName: 'Hemachandran',
                    lastName: 'Madivanane'
                };

                const res = await server.inject({
                    method: 'POST',
                    url: '/customer',
                    payload: payload
                });
                expect(res.statusCode).to.equal(201);
            });

            it('successfully create customer with firstName', async () => {
                const payload = {
                    firstName: 'Peter'
                };
                const res = await server.inject({
                    method: 'POST',
                    url: '/customer',
                    payload: payload
                });
                expect(res.statusCode).to.equal(201);
            });

            it('successfully create customer with firstName and lastName to include customerId', async () => {
                const payload = {
                    firstName: 'David',
                    lastName: 'Smith'
                };
                const res = await server.inject({
                    method: 'POST',
                    url: '/customer',
                    payload: payload
                });
                expect(res.statusCode).to.equal(201);
                expect(JSON.stringify(res.result)).contain('customerId');
            });
        });

        describe('Invalid scenarios', () => {
            it('responds with 400 when firstName and lastName missing', async () => {
                const payload = {};
                const res = await server.inject({
                    method: 'POST',
                    url: '/customer',
                    payload: payload
                });
                expect(res.statusCode).equal(400);
                expect(JSON.stringify(res.result)).contain('CreateCustomerRequest')
                    .and.contain('at least one of [firstName, lastName]');
            });

            it('responds with 400 when create customer with invalid input ', async () => {
                const payload = {
                    firstName: 123,
                    lastName: 'Smith'
                };
                const res = await server.inject({
                    method: 'POST',
                    url: '/customer',
                    payload: payload
                });
                expect(res.statusCode).equal(400);
                expect(JSON.stringify(res.result)).contain('firstName')
                    .and.contain('must be a string');
            });
        });
    });
});
