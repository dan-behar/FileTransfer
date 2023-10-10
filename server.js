require("dotenv").config()
const multer = require("multer")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const File = require("./models/File")

const http = require('http');

const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.ACCESS_SECRET_ID,
  region: 'us-east-1',
});

const s3 = new AWS.S3();

const express = require("express")
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'));

const upload = multer({ storage: multer.memoryStorage()})

mongoose.connect("mongodb://localhost:27017/fileSharing")

app.set("view engine", "ejs")

app.get("/", (req, res) => {
  res.render("index")
})

app.post("/upload", upload.single("file"), async (req, res) => {
  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: req.file.originalname,
    Body: req.file.buffer,
  };

  const fileData = {
    path: process.env.AWS_BUCKET,
    originalName: req.file.originalname,
  }
  if (req.body.password != null && req.body.password !== "") {
    fileData.password = await bcrypt.hash(req.body.password, 10)
  }

  const file = await File.create(fileData)

  s3.upload(params, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error uploading file');
    }
  });

  res.render("index", { fileLink: `${req.headers.origin}/file/${file.id}` })
})

app.route("/file/:id").get(handleDownload).post(handleDownload)

async function handleDownload(req, res) {
  const file = await File.findById(req.params.id)

  if (file.password != null) {
    if (req.body.password == null) {
      res.render("password")
      return
    }

    if (!(await bcrypt.compare(req.body.password, file.password))) {
      res.render("password", { error: true })
      return
    }
  }

  file.downloadCount++
  await file.save()
  console.log(file.downloadCount)

  var fileKey = req.query['fileKey'];

  var options = {
    Bucket: file.path,
    Key: file.originalName,
  };
  res.attachment(fileKey);
  var fileStream = s3.getObject(options).createReadStream();
  fileStream.pipe(res);
}

http.createServer(app).listen(8080)
