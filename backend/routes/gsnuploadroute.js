const express = require('express')
const router = express.Router()
const gsnHandler= require('../controllers/gsnmain.controller')

const path = require('path')
const fs = require('fs')
const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const filepath = path.join(__dirname, '../gsnfiles'); // Ensure the path is correct
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



router.post('/',upload.single('file'),gsnHandler.uploaddata)

module.exports=router