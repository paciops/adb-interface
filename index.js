var espress = require('express');
var app = espress(),
    adb = require('adbkit'),
    client = adb.createClient();

app.use(espress.static('public'));

var server = app.listen(8080, function () {
  console.info('http://localhost:'+server.address().port);
});

var status = {};

app.get('/status', function (req, res) {
  res.send(status);
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
