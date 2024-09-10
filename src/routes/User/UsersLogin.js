const express = require("express");
const sql = require("mssql");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const sqlConfig = require("../../DataBase/SqlConfig");
const router = express.Router();
const dotenv = require('dotenv');
const ENV = require('../../../.env');
dotenv.config(ENV);
// const JWT_SECRET = process.env.JWT_SECRET;
const JWT_SECRET = "TheTitanAIChatBot";

// USER REGISTERATION API END POINT
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        return res.status(200).send({ code: 1001, message: "Email is required" });
    } else if (!password) {
        return res.status(200).send({ code: 1001, message: "Password is required" });
    }
    try {
        const pool = await sql.connect(sqlConfig);
        // Check if the user already exists
        const userCheck = await pool.request().input('email', sql.VarChar, email).query('SELECT * FROM RegisterUser WHERE email = @email');
        if (userCheck.recordset.length > 0) {
            return res.status(200).send({ code: 1002, message: "Sorry user already registered with us" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const data = { email: email, password: hashedPassword };
        const token = jwt.sign(data, JWT_SECRET);
        // Insert the new user into the database
        let result = await pool.request().input('email', sql.VarChar, email).input('password', sql.VarChar, hashedPassword).query('INSERT INTO RegisterUser (email, password) VALUES (@email, @password)');
        const userData = { ...data, ...{ token: token, info: result.output } }
        res.status(200).send({ code: 1000, message: "User registered successfully", user: userData });
        pool.close();
    } catch (error) {
        // console.log("error==>", error);
        return res.status(500).send({ code: 5000, message: "Internal Server Error" });
    }
});

// USER LOGIN API

router.post('/login', async (req, res) => {
    const { email, password } = await req.body;
    if (!email) {
        return res.status(200).send({ code: 1001, message: "Email is required" });
    } else if (!password) {
        return res.status(200).send({ code: 1001, message: "Password is required" });
    }
    try {
        const pool = await sql.connect(sqlConfig);
        const result = await pool.request().query(`SELECT * FROM RegisterUser WHERE email = '${email}'`);
        if (result.recordset.length === 0) {
            return res.status(200).send({ code: 1002, message: "User not registred with us" });
        }
        const user = result.recordset[0];
        const isMatchPwd = await bcrypt.compare(password, user.password);
        if (!isMatchPwd) {
            return res.status(200).send({ code: 1003, message: "Incorrect password" });
        }
        const token = jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
        const userData = { ...user, ...{ token: token } }
        res.status(200).send({ code: 1000, message: 'login successfully', user: userData });
    } catch (error) {
        // console.log("error==>", error);
        return res.status(500).send({ code: 5000, message: "Internal Server Error" });
    }
})

// STORE STUDENTS INFORMATION API

router.post('/insert/students/marks/details', async (req, res) => {
    const { Student_Name, Mathematics, Physics, English, Hindi, Computer } = await req.body;
    const emptyFields = [];
    for (const [key, value] of Object.entries(await req.body)) {
        if (value === '') {
            emptyFields.push(key);
        }
    }
    if (emptyFields.length > 0) {
        return res.status(200).send({ code: 1001, message: `Please Enter ${emptyFields} Marks` });
    }

    try {
        let pool = await sql.connect(sqlConfig);
        const Total = Mathematics + Physics + English + Hindi + Computer;
        const Percentage = Total / 5;
        let result = await pool.request()
            .input('Student_Name', sql.VarChar, Student_Name).
            input('Mathematics', sql.Int, Mathematics).
            input('Physics', sql.Int, Physics).
            input('English', sql.Int, English).
            input('Hindi', sql.Int, Hindi).
            input('Computer', sql.Int, Computer).
            input('Total', sql.Int, Total).
            input('Percentage', sql.Int, Percentage)
            .query('INSERT INTO Students_Info (Student_Name, Mathematics, Physics, English, Hindi, Computer, Total, Percentage) VALUES (@Student_Name, @Mathematics, @Physics, @English, @Hindi, @Computer, @Total, @Percentage)');
        const StudenstsData = {
            Student_Name: Student_Name,
            Mathematics: Mathematics,
            Physics: Physics,
            English: English,
            Hindi: Hindi,
            Computer: Computer,
            Total: Total,
            Percentage: Percentage
        }
        if (result.rowsAffected) {
            res.status(200).send({ code: 1000, message: "Student Details Inserted Successfully", data: StudenstsData, result: result.output });
        }
    } catch (error) {
        return res.status(500).send({ code: 5000, message: "Internal Server Error" });
    }
})

module.exports = router;