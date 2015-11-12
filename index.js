var express = require('express');
var app = express(),
    adb = require('adbkit'),
    client = adb.createClient(),
    colors = require('colors'),
    bodyParser = require('body-parser'),
    ip = require('ip'),
    nic, netStatus, dPort = 5555,
    portscanner = require('portscanner');

app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(express.static('public'));

var server = app.listen(8080, function () {
  console.info(('http://'.red+(ip.address()).yellow+':'+(server.address().port+'').cyan).bold);
});

var status = {};

app.get('/status', function (req, res) {
  res.send(status);
});
app.post('/interface', function(req, res) {
  nic = req.body.nic;
  netStatus = require('os').networkInterfaces()[nic];
  if (netStatus===undefined) {
    res.send(null);
  }else {
    var data = ip.subnet(ip.address(), netStatus[0]['netmask']);
    var first = ip.toLong(data.firstAddress);
    var end = {},
        m=0;
    for (var i = 0; i < data.numHosts; i++) {
      (function (n, int) {
        portscanner.checkPortStatus(dPort, n, function(error, status) {
          if (status==='open'){
            end[m]=n;
            m++;
          }
          if (int===data.numHosts-1)
            res.send(end);
        });
      }(ip.fromLong(first+i),i));
    }
  }
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
