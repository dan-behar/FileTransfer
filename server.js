require("dotenv").config()
const multer = require("multer")
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const http = require('http');
const AWS = require('aws-sdk');

// AWS Configuration and calling
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.ACCESS_SECRET_ID,
  region: process.env.AWS_REGION,
});
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const docClient = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();
//-------------------------------

const express = require("express")
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'));

const upload = multer({ storage: multer.memoryStorage()})

app.set("view engine", "ejs")

// First view
app.get("/", (req, res) => {
  res.render("index")
  var moment = (new Date()).valueOf().toString();

  // Logs
  docClient.put({
    TableName: process.env.AWS_TABLE_LOGS,
    Item: {
      numdate: moment,
      page: "main",
      host: req.headers['host'],
      mobile: req.headers['sec-ch-ua-mobile'],
      platform: req.headers['sec-ch-ua-platform'],
      ip: req.socket.remoteAddress,
      fileid: null
    }
  }, (err, data)=>{
    if (err) {
      console.error(err);
      return res.status(500).send('Error uploading file');
    }
  });
})

//Upload view
app.post("/upload", upload.single("file"), async (req, res) => {

  //Defining hash names for ID and name
  var current_date = (new Date()).valueOf().toString();
  var random = Math.random().toString();
  var namehash = crypto.createHash('sha1').update(current_date + random).digest('hex');

  var current_date2 = (new Date()).valueOf().toString();
  var random2 = Math.random().toString();
  var di = crypto.createHash('sha1').update(current_date2 + random2).digest('hex');

  // Params to send the file to S3
  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: namehash,
    Body: req.file.buffer,
  };

  if (req.body.password != null && req.body.password !== "") {
    passwd = await bcrypt.hash(req.body.password, 10)
  } else {
    passwd = ""
  }

  // Storing the information in DynamoDB
  docClient.put({
    TableName: process.env.AWS_TABLE,
    Item: {
      id: di,
      path: process.env.AWS_BUCKET,
      hashname: namehash,
      originalName: req.file.originalname,
      password: passwd,
      downloadCount: 0
    }
  }, (err, data)=>{
    if (err) {
      console.error(err);
      return res.status(500).send('Error uploading file');
    }
  });

  // Uploading the file to S3
  s3.upload(params, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error uploading file');
    }
  });

  var moment = (new Date()).valueOf().toString();

  // Logs
  docClient.put({
    TableName: process.env.AWS_TABLE_LOGS,
    Item: {
      numdate: moment,
      page: "upload",
      host: req.headers['host'],
      mobile: req.headers['sec-ch-ua-mobile'],
      platform: req.headers['sec-ch-ua-platform'],
      ip: req.socket.remoteAddress,
      fileid: di
    }
  }, (err, data)=>{
    if (err) {
      console.error(err);
      return res.status(500).send('Error uploading file');
    }
  });

  res.render("index", { fileLink: `${req.headers.origin}/file/${di}` })
})

app.route("/file/:id").get(handleDownload).post(handleDownload)

// Download file
async function handleDownload(req, res) {

  var moment = (new Date()).valueOf().toString();

  // Logs
  docClient.put({
    TableName: process.env.AWS_TABLE_LOGS,
    Item: {
      numdate: moment,
      page: "download",
      host: req.headers['host'],
      mobile: req.headers['sec-ch-ua-mobile'],
      platform: req.headers['sec-ch-ua-platform'],
      ip: req.socket.remoteAddress,
      fileid: req.params.id
    }
  }, (err, data)=>{
    if (err) {
      console.error(err);
      return res.status(500).send('Error uploading file');
    }
  });

  // Getting the information from DynamoDB
  try {
    var params = {
        Key: {
         "id": {"S": req.params.id},
        }, 
        TableName:  process.env.AWS_TABLE
    };
    var result = await dynamodb.getItem(params).promise()
  } catch (error) {
      console.error(error);
  }

  // Checking if ID exists
  if (Object.keys(result).length === 0){
    res.redirect('/');
    return
  }

  // Confirming password
  if (result.Item.password.S != "") {
    if (req.body.password == null) {
      res.render("password")
      return
    }

    if (!(await bcrypt.compare(req.body.password, result.Item.password.S))) {
      res.render("password", { error: true })
      return
    }
  }

  // Updating the downloads
  const params2 = {
    TableName: process.env.AWS_TABLE,
    Key: {
        "id": result.Item.id.S
    },
    UpdateExpression: "set downloadCount = :num",
    ExpressionAttributeValues: {
        ":num": parseInt(result.Item.downloadCount.N) + 1
    }
};

docClient.update(params2, function(err, data) {
    if (err) console.log(err);
});

 // Getting the file from S3
  var fileName = result.Item.originalName.S;
  var options = {
     Bucket: result.Item.path.S,
     Key: result.Item.hashname.S,
   };
   res.attachment(fileName);
   var fileStream = s3.getObject(options).createReadStream();
   fileStream.pipe(res);
}

http.createServer(app).listen(8080)