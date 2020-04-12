module.exports = {
    up: (queryInterface) => {
        const db = queryInterface.sequelize;
        return db.query('CREATE TABLE IF NOT EXISTS customer(customer_id INTEGER PRIMARY KEY AUTOINCREMENT, first_name VARCHAR(50), last_name VARCHAR(50), version INTEGER NOT NULL DEFAULT 0);')
    },

    down: () => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.dropTable('customer');
        */
    }
};
