/*var exec = require('child_process').exec,
    child;

child = exec('adb',
  function (error, stdout, stderr) {
    console.log(stdout);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
});
portscanner.checkPortStatus(9091, IP.v4(), function(error, status) {
  console.log('port: 9091 is '+status);
});
*/

//var IP = require('internal-ip'); NON SERVE PIU'
var portscanner = require('portscanner');
var ip = require('ip');
var nic = 'wlan0';

//### codice ###
var subnet = require('os').networkInterfaces()[nic][0]['netmask'];
var data = ip.subnet(ip.address(), subnet);
var primo = ip.toLong(data.firstAddress);
for (var i = 0; i < data.numHosts; i++) {
  (function (n) {
    portscanner.checkPortStatus(5555, n, function(error, status) {
      if (status==='open'){
        console.log(n+':'+status);
      }
    });
  }(ip.fromLong(primo+i)));
}
