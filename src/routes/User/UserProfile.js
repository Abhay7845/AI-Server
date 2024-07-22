const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const app = express();

const storage = multer.diskStorage({
    destination: "./upload/img",
    filename: (req, file, callBack) => {
        return callBack(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});

const upload = multer({ storage: storage });

app.use('/profile', express.static('./upload/img'));
router.post('/upload/profile', upload.single('profile'), (req, res) => {
    const { file } = req;
    console.log(req.file);
    if (!file) {
        return res.status(200).send({ status: false, message: "please select file" })
    }
    try {
        if (file) {
            res.status(200).send({ status: true, message: "file uploaded successfully", url: `http://localhost:49172/profile/${req.file.filename}` })
        }
    } catch (error) {
        // console.log("error==>", error);
        return res.status(500).send({ status: false, message: "Internal Server Error" });
    }
})


module.exports = router;