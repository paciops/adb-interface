/* jshint node: true */
var express = require('express');
var debug = require('debug')('express'),
    adb = require('adbkit'),
    portscanner = require('portscanner'),
    colors = require('colors'),
    ip = require('ip'),
    client = adb.createClient(),
    dPort = 5555,
    statusC = {},
    app = express(),
		bodyParser = require('body-parser'),
		Promise = require('bluebird');

app.use(express.static('public'));
app.use('/node_modules',express.static('node_modules'));
app.use(bodyParser.raw({
	limit:'100mb',
	type:'application/vnd.android.package-archive'
}));

var server = app.listen(8080, function () {
  console.info(('http://'.red+(ip.address()).yellow+':'+(server.address().port+'').cyan).bold);
});

app.get('/status', function (req, res) {
  res.send(statusC);
  debug(statusC);
});

app.get('/interface', function(req, res) {
  var nic = req.query.nic,
      netStatus = require('os').networkInterfaces()[nic];

  if (netStatus===undefined) {
    res.status(404).send('nope');
  } else {
    var data = ip.subnet(ip.address(), netStatus[0].netmask),
        first = ip.toLong(data.firstAddress),
        end = {};
    var m = 0;

    for (var i = 0; i < data.numHosts; i++){
      (function (ip, int) {
        portscanner.checkPortStatus(dPort, ip, function(error, status) {
          if (status==='open'){
            end[m] = ip;
            m++;
          }
          if (int===data.numHosts-1) {
            debug('to %s',req.ip.magenta);
            debug(end);
            res.send(end);
          }
        });
      })(ip.fromLong(first+i),i);
    }
  }

});

app.post('/apkdata', function (req, res) {
	var fs = require('fs');
	fs.writeFileSync('diorco.apk', req.body, 'utf-8');
	res.send('dio cane');
	client.listDevices()
		.then(function(devices){
			return Promise.map(devices, function(device) {
				console.log(device);
				return client.install(device.id, 'diorco.apk');
			});
	});
});

client.trackDevices()
  .then(function(tracker) {
    tracker.on('add', function(device) {
      statusC[device.id] = 'plugged';
    });
    tracker.on('remove', function(device) {
      statusC[device.id] = 'unplugged';
    });
    tracker.on('end', function() {
      statusC = 'Tracking stopped';
    });
  })
  .catch(function(err) {
    console.error('Something went wrong:', err.stack);
  });
