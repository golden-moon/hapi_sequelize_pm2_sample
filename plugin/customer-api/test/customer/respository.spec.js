const chai = require('chai');
const { createCustomers } = require('../../customer/repository');
const {
    testDB
} = require('../../../../ext/database');

const { assert } = chai;
const should = chai.should();

let db;

before(async ()=>{
    if (!db)
        db = await testDB();
})

describe('CustomerRepository', () => {
    describe('#createCustomers', () => {
        const customerJohn = {
            firstName: 'John',
            lastName: 'Smith'
        };
        const customerPeter = {
            firstName: 'Peter',
            lastName: 'Smith'
        };

        it('should create customer', async () => {
            const result = await createCustomers(customerJohn, db);
            assert.isNumber(result);
        });

        it('should create 2 different customers for different customers', async () => {
            const johnResult = await createCustomers(customerJohn, db);
            const peterResult = await createCustomers(customerPeter, db);
            assert.notEqual(johnResult, peterResult);
        });

        it('should create 1 customer record and 2 different contacts for the same customer', async () => {
            const johnResult1 = await createCustomers(customerJohn, db);
            const johnResult2 = await createCustomers(customerJohn, db);
            assert.equal(johnResult1, johnResult2);
        });
    });
});
