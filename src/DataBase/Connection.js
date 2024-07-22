const sql = require('mssql');
const sqlConfig = require('./SqlConfig')

const DatabaseConnection = async () => {
    try {
        await sql.connect(sqlConfig);
        console.log('DataBase Connected Successfully');
        await sql.close();
    } catch (err) {
        console.error('connection error==>', err);
    }
}

module.exports = DatabaseConnection;