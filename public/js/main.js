/*jslint browser:true */
window.onload = function() {
  'use strict';
  document.getElementById('search').onclick = function() {src = true; connectedDevices();};
  document.getElementById('stop').onclick = function() {src = false; document.getElementById('searchStatus').innerHTML='Click START to search';};
  document.getElementById('scan').onclick = function() {
    for(var i =0; i< 10;i++){
       (function(a){
            setTimeout(function(){ checkInterface(document.getElementById('inpInt').value);}, a*time);
       })(i);
    }
  };
	document.getElementById('install').onclick = function() {
		if (document.getElementById('inputFile').files[0] === undefined || document.getElementById('inputFile').files[0].type !== 'application/vnd.android.package-archive')
			notie.alert(3, 'Error.<br>No APK inserted', 0.5);
		else{
			console.log(document.getElementById('inputFile').files[0]);
			var sendAPK = new XMLHttpRequest();
			sendAPK.open('POST','/apkdata');
			sendAPK.send(document.getElementById('inputFile').files[0]);
		}
	};
  var httpRequest,
      json = {},
      keys,
      src,
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
            document.getElementById('status').innerHTML+='<li>'+keys[i]+' '+json[keys[i]];
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
        console.log('è nope cambio il banner');
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
          document.getElementById('netD').innerHTML+='<li>'+resJ[cont];
          cont++;
        }
      }
    };
    inter.open('GET', '/interface?nic='+nic, true);
    inter.send();
  }
};
