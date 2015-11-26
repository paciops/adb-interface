/*jslint browser:true */
var src;
window.onload = function() {
  'use strict';
  document.getElementById('search').onclick = function() {src = true; connectedDevices();};
  document.getElementById('stop').onclick = function() {src = false; document.getElementById('searchStatus').innerHTML='Click START to search';};
  document.getElementById('scan').onclick = function() {checkInterface(document.getElementById('inpInt').value);};
	document.getElementById('install').onclick = function() {
		if (document.getElementById('inputFile').files[0] === undefined || document.getElementById('inputFile').files[0].type !== 'application/vnd.android.package-archive')
			notie.alert(3, 'Error.<br>No APK inserted', 0.5);
		else{
			var sendAPK = new XMLHttpRequest();
			sendAPK.open('POST','/apkdata');
			sendAPK.send(document.getElementById('inputFile').files[0]);
		}
	};
  var httpRequest,
      json = {},
      keys,
      time = 1500,
      inter;
	
	function connectedDevices() {
    if(src) {
      httpRequest = new XMLHttpRequest();
      if (!httpRequest) {
        return false;
      }
      httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
          json = JSON.parse(httpRequest.response);
          keys = Object.keys(json);
          document.getElementById('status').innerHTML='';
          for (var i = 0; i < keys.length; i++) {
            document.getElementById('status').innerHTML+='<li class="connected" onclick="selectedMe(this)">'+keys[i]+' '+json[keys[i]];
          }
          setTimeout(function() {
            connectedDevices();
          }, time);
        }
      };
      document.getElementById('searchStatus').innerHTML='Searching...';
      httpRequest.open('GET', '/status');
      httpRequest.send();
    }
  }

  function checkInterface(nic) {
    inter = new XMLHttpRequest();
    if (!inter) {
      alert('no ajax');
      return false;
    }
    inter.onreadystatechange = function(){
      var msgStyle = document.getElementById('msg').style;
      if (inter.responseText==='nope'){
        msgStyle.display = 'block';
        msgStyle.opacity = 1;
      }
      if (inter.readyState === 4 && inter.status === 200){
        msgStyle.opacity = 0;
        setTimeout(function(){msgStyle.display = 'none';},1500);
        var resJ = JSON.parse(inter.responseText),
            cont = 0;
        document.getElementById('netD').innerHTML='';
        while (resJ[cont]!==undefined) {
          document.getElementById('netD').innerHTML+='<li onclick="connectToDevice(this.innerHTML)">'+resJ[cont];
          cont++;
        }
      }
    };
    inter.open('GET', '/interface?nic='+nic, true);
    inter.send();
  }
};

function connectToDevice(ip) {
	var sendDevice = new XMLHttpRequest();
	notie.alert(4, 'Connecting to '+ip, 2);
	sendDevice.open('POST','/connectToDevice');
	sendDevice.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	sendDevice.send('ip='+ip);
}

function selectedMe(elem) {
	src = false;
	var device = elem.innerHTML.split(' ')[0];
	notie.alert(4, device + ' selected', 2);
	var select = new XMLHttpRequest();
	select.open('POST','/setDevice');
	select.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	select.send('id='+device);
};