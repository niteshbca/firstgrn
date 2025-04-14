const express = require('express')
const router = express.Router()
const handler= require('../controllers/main.controller')

const path = require('path')
const fs = require('fs')
const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const filepath = path.join(__dirname, '../files'); // Ensure the path is correct
    console.log("Saving file to:", filepath);

    // Create the directory if it doesn't exist
    if (!fs.existsSync(filepath)) {
      fs.mkdirSync(filepath, { recursive: true });
    }
    cb(null, filepath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  }
});

const upload = multer({ storage: storage });



router.post('/',upload.single('file'),handler.uploaddata)

module.exports=router