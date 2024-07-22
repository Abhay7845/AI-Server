const dotenv = require('dotenv');
const ENV = require('../../.env');
dotenv.config(ENV);

// const DB_USER = "npimtst";
// const DB_PASSWORD = "Abhay@1234";
// const DB_DATABASE = "TEST";
// const DB_SERVER = "172.25.7.121";
// const DB_PORT = 49172;

const sqlConfig = {
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false,
        trustServerCertificate: false
    }
};

module.exports = sqlConfig;
