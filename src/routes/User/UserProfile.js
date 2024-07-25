const express = require("express");
const sql = require("mssql");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const sqlConfig = require("../../DataBase/SqlConfig");


// UPLOAD IMAGE FORMATE
const ImgStorage = multer.diskStorage({
    destination: "./upload/img",
    filename: (req, file, callBack) => {
        return callBack(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});

const uploadImg = multer({ storage: ImgStorage });

router.post('/upload/profile', uploadImg.single('profile'), (req, res) => {
    const { file } = req;
    if (!file) {
        return res.status(200).send({ status: false, message: "please select file" })
    }
    try {
        if (file) {
            res.status(200).send({ status: true, message: "file uploaded successfully", url: `http://localhost:49172/api/user/${req.file.filename}` })
        }
    } catch (error) {
        // console.log("error==>", error);
        return res.status(500).send({ status: false, message: "Internal Server Error" });
    }
});



// UPLOAD VIDEO FORMATE

const VideoStorage = multer.diskStorage({
    destination: "./upload/video",
    filename: (req, file, callBack) => {
        return callBack(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});

const uploadVideo = multer({ storage: VideoStorage });

router.post('/upload/video', uploadVideo.single('video'), async (req, res) => {
    const { description } = await req.body;
    if (!req.file) {
        return res.status(200).send({ status: false, message: "please select video file" })
    }
    try {
        const pool = await sql.connect(sqlConfig);
        const v_url = `http://localhost:19317/api/user/${req.file.filename}`;
        const v_data = await pool.request().query('select * from Test_Videos');
        const id = v_data.recordset.length + 1;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('description', sql.VarChar, description)
            .input('videoUrl', sql.VarChar, v_url).
            query('INSERT INTO Test_Videos (id, description, videoUrl) VALUES (@id, @description, @videoUrl)');
        const v_Info = {
            id: id,
            description: description,
            v_url: v_url,
        }
        if (result.rowsAffected) {
            res.status(200).send({ status: true, message: "video uploaded successfully", data: v_Info })
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: "Internal Server Error" });
    }
})

// GET UPLOADED VIDEO 
router.get('/get/uploded/public/video', async (req, res) => {
    try {
        const pool = await sql.connect(sqlConfig);
        const videos = await pool.request().query('select * from Test_Videos');
        if (videos.recordset.length > 0) {
            res.status(200).send({ status: true, message: "video fetched successfully", data: videos.recordset });
        } else {
            res.status(200).send({ status: false, message: "videos are not available", data: videos.recordset });
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: "Internal Server Error" });
    }
})


// DELETE VIDEO 
router.delete('/delete/public/video/:id', async (req, res) => {
    const { id } = req.params;
    if (isNaN(id)) {
        return res.status(200).send({ status: false, message: "id must be in number formate" });
    }
    try {
        const pool = await sql.connect(sqlConfig);
        const deleteVdo = await pool.request().input('id', sql.Int, id).query(`DELETE FROM Test_Videos WHERE id = @id`);
        if (deleteVdo.rowsAffected) {
            res.status(200).send({ status: true, message: `id is '${id}' video is deleted successfully` });
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: "Internal Server Error" });
    }
})

module.exports = router;