const dotenv = require('dotenv');
const ENV = require('../../.env');
dotenv.config(ENV);

// const DB_USER = "npimtst";
// const DB_PASSWORD = "Abhay@1234";
// const DB_DATABASE = "TEST";
// const DB_SERVER = "172.25.7.121";
// const DB_PORT = 49172;

// DB_USER = "Test_Admin"
// DB_PASSWORD = "Test_Admin@1234"
// DB_DATABASE = "Test_Aryan_01"
// DB_SERVER = "108.181.197.190"
// DB_PORT = 19317
// JWT_SECRET = "TheTitanAIChatBot"

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
        encrypt: true,
        trustServerCertificate: true
    }
};

module.exports = sqlConfig;
