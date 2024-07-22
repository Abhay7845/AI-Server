const dotenv = require('dotenv');
const ENV = require('../../.env');
dotenv.config(ENV);


const sqlConfig = {
    server: process.env.DB_SERVER,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: DB_PASSWORD,
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
