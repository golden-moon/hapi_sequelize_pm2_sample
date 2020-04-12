const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const Umzug = require('umzug');
const {UNABLE_TO_CONNECT_DATABASE, DATABASE_CONNECTED} = require('./logger/eventType');
const basename = path.basename(__filename);

const database = (server) => {
    const db = {};
    const password = server.db.password;
    const host = server.db.host;

    const sequelize = new Sequelize(server.db.database, server.db.username, password, {
        host,
        dialect: server.db.dialect,
        port: server.db.port,
        storage: server.db.storage,
        pool: {maxConnections: 5, maxIdleTime: 30},
        language: 'en',
        dialectOptions: {
            connectTimeout: 60000
        }
    });

    fs
        .readdirSync(__dirname)
        .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
        .forEach((file) => {
            const model = sequelize.import(path.join(__dirname, file));
            db[model.name] = model;
        });

    Object.keys(db).forEach((modelName) => {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });

    db.sequelize = sequelize;
    db.Sequelize = Sequelize;

    return db;
};


const databaseSetup = async (server) => {
    let password = server.db.password;
    let host = server.db.host;
    const migrationPath = server.db.migrationPath;
    const sequelize = new Sequelize(server.db.database, server.db.username, password, {
        host,
        dialect: server.db.dialect,
        port: server.db.port,
        storage: server.db.storage,
        pool: {maxConnections: 5, maxIdleTime: 30},
        language: 'en',
        dialectOptions: {
            connectTimeout: 60000
        }
    });

    const umzug = new Umzug({
        storage: 'sequelize',
        storageOptions: {
            sequelize
        },

        migrations: {
            params: [
                sequelize.getQueryInterface(), // queryInterface
                sequelize.constructor, // DataTypes
                () => {
                    throw new Error('Migration tried to use old style "done" callback. Please upgrade to "umzug" and return a promise instead.');
                }
            ],
            path: __dirname + migrationPath,
            pattern: /\.js$/
        }
    });


    const logUmzugEvent = eventName => (name) => {
        console.log({
            event: `${name} => ${eventName}`
        }, 'info');
    };
    sequelize
        .authenticate()
        .then(() => {
            console.log({
                event: DATABASE_CONNECTED
            }, 'info');
        })
        .catch((err) => {
            console.error({
                event: `${UNABLE_TO_CONNECT_DATABASE} ${err}`
            }, 'error');
        });

    umzug.on('migrating', logUmzugEvent('MIGRATING'));
    umzug.on('migrated', logUmzugEvent('MIGRATED'));
    umzug.on('reverting', logUmzugEvent('REVERTING'));
    umzug.on('reverted', logUmzugEvent('REVERTED'));

    return await umzug.up();
};


exports.register = async (server, options) => {
    try {
        await databaseSetup(options)
        const db = database(options);
        console.log("Database setup and migration done successfully");
        server.decorate('server', 'database', db);
    }catch (error) {
        console.error("Error occured while database setup");
        process.exit(1);
    }
};

exports.testDB = async () => {
    try {
        const options = {
            "db": {
                "dialect": "sqlite",
                "port": "",
                "host": "localhost",
                "username": "",
                "password": "",
                "migrationStorage": "sequelize",
                "database": "customerTransactionDb",
                "logging": false,
                "storage": "localDev.sqlite",
                "migrationPath": "/migrations/sqlite"
            }
        };
        await databaseSetup(options)
        return database(options);
    }catch (error) {
        console.error("Error occured while database setup");
        console.error(error);
        process.exit(1);
    }
};

exports.name = "database";
exports.pkg = require('./package.json');