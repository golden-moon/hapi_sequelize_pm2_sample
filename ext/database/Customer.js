module.exports = (sequelize, DataTypes) => sequelize.define('Customer', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        field: 'customer_id'
    },
    firstName: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    lastName: {
        type: DataTypes.STRING(50),
        allowNull: true
    }
}, {
    tableName: 'customer',
    version: true,
    createdAt: false,
    updatedAt: false,
    underscored: true
});

/* any associations can be added later
    Customer.associate = (db) => {
    Customer.belongsTo(db.transaction, { foreignKey: 'transaction_id' });
    Customer.belongsToMany(db.phoneNumber, { through: 'contact', foreignKey: 'customer_id', otherKey: 'phone_id' });
};*/

