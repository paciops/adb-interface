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
		deviceID,
    app = express(),
		bodyParser = require('body-parser'),
		Promise = require('bluebird');

app.use(express.static('public'));
app.use('/node_modules',express.static('node_modules'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.raw({
	limit:'100mb',
	type:'application/vnd.android.package-archive'
}));

var server = app.listen(8080, function () {
  console.log(('http://'.red+(ip.address()).yellow+':'+(server.address().port+'').cyan).bold);
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

app.post('/connectToDevice', function (req, res) {
	client.connect(req.body.ip, dPort);
	res.send('Connecting to the device...');
});

app.post('/setDevice', function(req, res) {
	deviceID = req.body.id;
	client.shell(deviceID, "pm list packages -f | sed -e 's/.*=//' | sort")
		.then(adb.util.readAll)
		.then(function(output) {
			var out = output.toString().trim();
			res.send(out);
		});
});

app.post('/apkInstall', function (req, res) {
	var fs = require('fs');
	client.listDevices()
		.then(function(devices){
			return Promise.map(devices, function() {
				fs.writeFileSync('file.apk', req.body, 'utf-8');
				console.log('Instaling...');
				return client.install(deviceID, 'file.apk');
			});
	})
	.then(function() {
    console.log('APK installed on '+deviceID);
		res.send('APK installed');
  })
  .catch(function(err) {
    res.send(err.stack).status(500);
		console.log(err.stack.red);
  })
	.then(function() {
		fs.unlinkSync('file.apk');
	});
	
});

app.post('/apkUninstall', function(req, res) {
	
})

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
