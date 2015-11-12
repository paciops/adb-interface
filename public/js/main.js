window.onload = function() {
  'use strict';
  document.getElementById('search').onclick= function() {src = true; connectedDevices()};
  document.getElementById('stop').onclick= function() {src = false};
  checkInterface(document.getElementById('inpInt').value);
  var httpRequest,
      json = {},
      keys,
      src,
      time = 15000,
      inter;


  function connectedDevices() {
    if(src) {
      httpRequest = new XMLHttpRequest();
      if (!httpRequest) {
        alert('NOPE');
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
      httpRequest.open('GET', '/status');
      httpRequest.send();
    }
  };

  function checkInterface(nic) {
    inter = new XMLHttpRequest();
    if (!inter) {
      alert('no ajax');
      return false;
    }
    inter.onreadystatechange = function(){
      if (inter.readyState == 4 && inter.status == 200){
          if (inter.responseText) {
            var r = JSON.parse(inter.responseText);
            console.log(r);
            document.getElementById('netD').innerHTML=r;
          }
        setTimeout(function () {
          checkInterface(document.getElementById('inpInt').value);
        },time);
      }
    };
    inter.open('POST', '/interface', true);
    inter.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    inter.send('nic='+nic);
  };
};
