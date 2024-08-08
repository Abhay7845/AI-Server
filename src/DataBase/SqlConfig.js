const dotenv = require('dotenv');
const ENV = require('../../.env');
dotenv.config(ENV);

const DB_USER = "npimtst";
const DB_PASSWORD = "Abhay@1234";
const DB_DATABASE = "TEST";
const DB_SERVER = "172.25.7.121";
const DB_PORT = 49172;

// DB_USER = "Test_Admin"
// DB_PASSWORD = "Test_Admin@1234"
// DB_DATABASE = "Test_Aryan_01"
// DB_SERVER = "108.181.197.184"
// DB_PORT = 10073
// JWT_SECRET = "TheTitanAIChatBot"

const sqlConfig = {
    server: DB_SERVER,
    port: parseInt(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

module.exports = sqlConfig;
