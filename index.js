const express = require("express");
const helmet = require('helmet');
const dotenv = require('dotenv');
const cors = require("cors");
const bodyParser = require('body-parser')
const app = express();
const connectTOdb = require('./src/DataBase/Connection')
connectTOdb();
app.use(express.json());

// SECURITY HEADERS 
app.use(helmet.noSniff());
app.use(helmet.referrerPolicy({ policy: 'no-referrer' }));
app.use(helmet.frameguard({ action: 'deny' }));
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
        },
    })
);
app.use(express.static('build'));

app.use(bodyParser.json());
app.use(cors());
const ENV = require('./.env');
dotenv.config(ENV);
const PORT = process.env.DB_PORT || 49172;
// Available Routes

app.use("/api/user", require("./src/routes/User/UsersLogin"));
app.use("/api/user", require("./src/routes/User/ChatBotQuearies"));
app.use("/api/user", require("./src/routes/User/UserProfile"));
app.use("/api/user", express.static("./upload/img"));
app.use("/api/user", express.static("./upload/video"));

app.listen(PORT, () => console.log(`Server is Running on PORT ${PORT}`));
