const express = require("express");
const dotenv = require('dotenv');
const cors = require("cors");
const bodyParser = require('body-parser')
const app = express();
const connectTOdb = require('./src/DataBase/Connection')
connectTOdb();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
const ENV = require('./.env');
dotenv.config(ENV);
const PORT = process.env.DB_PORT || 6000;
// Available Routes

app.use("/api/user", require("./src/routes/User/UsersLogin"));
app.use("/api/user", require("./src/routes/User/ChatBotQuearies"));
app.use("/api/user", require("./src/routes/User/UserProfile"));

app.listen(PORT, () => {
    console.log(`Server is Running on PORT ${PORT}`);
});
