const express = require("express");
const sql = require("mssql");
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
        return res.status(200).send({ status: false, message: "Email is required" });
    } else if (!password) {
        return res.status(200).send({ status: false, message: "Password is required" });
    }
    try {
        let pool = await sql.connect(sqlConfig);
        // Check if the user already exists
        let userCheck = await pool.request().input('email', sql.VarChar, email).query('SELECT * FROM TestRegisterUser WHERE email = @email');
        if (userCheck.recordset.length > 0) {
            return res.status(200).send({ status: false, message: "Sorry user already registered with us" });
        }
        const data = { email: email, password: password };
        const token = jwt.sign(data, JWT_SECRET);
        // Insert the new user into the database
        let result = await pool.request().input('email', sql.VarChar, email).input('password', sql.VarChar, password).query('INSERT INTO TestRegisterUser (email, password) VALUES (@email, @password)');
        const userData = { ...data, ...{ token: token, info: result.output } }
        res.status(200).send({ status: true, message: "User registered successfully", user: userData });
        pool.close();
    } catch (error) {
        // console.log("error==>", error);
        return res.status(500).send({ status: false, message: "Internal Server Error" });
    }
});

// USER LOGIN API

router.post('/login', async (req, res) => {
    const { email, password } = await req.body;
    if (!email) {
        return res.status(200).send({ status: false, message: "Email is required" });
    } else if (!password) {
        return res.status(200).send({ status: false, message: "Password is required" });
    }
    try {
        let pool = await sql.connect(sqlConfig);
        // Check if the user exists and the password matches
        let result = await pool.request().input('email', sql.VarChar, email).input('password', sql.VarChar, password).query('SELECT * FROM TestRegisterUser WHERE email = @email AND password = @password');
        if (result.recordset.length === 0) {
            return res.status(200).send({ status: false, message: "User not registred with us" });
        }
        const user = result.recordset[0];
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        const userData = { ...user, ...{ token: token } }
        res.status(200).send({ status: true, message: 'login successfully', user: userData });
    } catch (error) {
        console.log("error==>", error);
        return res.status(500).send({ status: false, message: "Internal Server Error" });
    }
})


// STORE STUDENTS INFORMATION API

router.post('/insert/students/marks/details', async (req, res) => {
    const { Student_Name, Mathematics, Physics, English, Hindi, Computer } = await req.body;
    if (!Student_Name || !Mathematics || !Physics || !English || !Hindi || !Computer) {
        return res.status(200).send({ status: false, message: "Please Enter Subjects Marks" });
    }
    try {
        let pool = await sql.connect(sqlConfig);
        const Total = Mathematics + Physics + English + Hindi + Computer;
        const Percentage = Total / 5;
        const stdData = await pool.request().query('SELECT * FROM Students_Info');
        const Id = stdData.recordset.length + 1;
        let result = await pool.request()
            .input('Id', sql.Int, Id)
            .input('Student_Name', sql.VarChar, Student_Name).
            input('Mathematics', sql.Int, Mathematics).
            input('Physics', sql.Int, Physics).
            input('English', sql.Int, English).
            input('Hindi', sql.Int, Hindi).
            input('Computer', sql.Int, Computer).
            input('Total', sql.Int, Total).
            input('Percentage', sql.Int, Percentage)
            .query('INSERT INTO Students_Info (Id, Student_Name, Mathematics, Physics, English, Hindi, Computer, Total, Percentage) VALUES (@Id, @Student_Name, @Mathematics, @Physics, @English, @Hindi, @Computer, @Total, @Percentage)');
        const StudenstsData = {
            Id: Id,
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
            res.status(200).send({ status: true, message: "Student Details Inserted Successfully", data: StudenstsData, result: result.output });
        }
    } catch (error) {
        // console.log("error==>", error);
        return res.status(500).send({ status: false, message: "Internal Server Error" });
    }
})

module.exports = router;