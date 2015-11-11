var express = require('express');
var app = express(),
    adb = require('adbkit'),
    client = adb.createClient(),
    IP = require('internal-ip'),
    colors = require('colors');
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(express.static('public'));

var server = app.listen(8080, function () {
  console.info(('http://'.red+(IP.v4()).yellow+':'+(server.address().port+'').cyan).bold);
});

var status = {};

app.get('/status', function (req, res) {
  res.send(status);
});
app.post('/interface', function(req, res) {
  console.log(typeof (req.body));
  console.log(req.body);
  res.send(req.body);
});

client.trackDevices()
  .then(function(tracker) {
    tracker.on('add', function(device) {
      status[device.id] = 'plugged';
    });
    tracker.on('remove', function(device) {
      status[device.id] = 'unplugged';
    });
    tracker.on('end', function() {
      status = 'Tracking stopped';
    });
  })
  .catch(function(err) {
    console.error('Something went wrong:', err.stack);
  });
