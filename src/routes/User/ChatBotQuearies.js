const express = require("express");
const nlp = require('compromise');
const sql = require("mssql");
const sqlConfig = require("../../DataBase/SqlConfig");
const router = express.Router();


// AI CHAT BOT RESOLVE QUERIES API
router.post('/ai/chat_bot/queries/resolve', async (req, res) => {
    const { text } = await req.body;
    const nameMatch = text.toLowerCase().match(/\b([a-z]+)\b/g);
    const name = nameMatch ? nameMatch[1] : null;
    console.log("name==>", name);
    const totalMarks = nameMatch ? nameMatch[2] : null;
    let pool = await sql.connect(sqlConfig);
    try {
        if (name === "all") {
            const result = await pool.request().query('SELECT * FROM Students_Info');
            return res.status(200).send({ status: true, message: "Records fetched successfully", data: result.recordset });
        } else {
            const result = await pool.request().query(`SELECT * FROM Students_Info where Student_Name='${name}'`);
            if (totalMarks === "total") {
                const total_sMarks = result.recordset.map(item => item.Total);
                const single_s_Data = {
                    student_Name: name,
                    total: total_sMarks[0],
                }
                return res.status(200).send({ status: true, message: total_sMarks.length > 0 ? "records fetched successfully" : `${name} records are not exist`, data: single_s_Data });
            } else {
                return res.status(200).send({ status: true, message: result.recordset.length > 0 ? "records fetched successfully" : `${name} records are not exist`, data: result.recordset });
            }
        }
    } catch (error) {
        // console.log("error==>", error);
        return res.status(500).send({ status: false, message: "Internal Server Error" });
    }
});

module.exports = router;