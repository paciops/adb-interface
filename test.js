/*var exec = require('child_process').exec,
    child;

child = exec('adb',
  function (error, stdout, stderr) {
    console.log(stdout);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
});
*//*
var portscanner = require('portscanner');
var IP = require('internal-ip');
var ip = require('ip');
var os = require('os');

//console.log(IP.v4());

portscanner.checkPortStatus(9091, IP.v4(), function(error, status) {
  console.log(status);
});
os.networkInterfaces().wlan0
*/
var app = require('express')();
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/profile', upload.array(), function (req, res, next) {
  console.log(req.body);
  res.json(req.body);
});
