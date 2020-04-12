/* eslint-disable no-await-in-loop */
const createCustomers = async (inputJs, db) => {

    [customer] = await db.Customer.findOrCreate({
        where: {
            firstName: inputJs.firstName || null,
            lastName: inputJs.lastName || null
        }
    });

    return customer.id;
};

module.exports = {
    createCustomers
};
