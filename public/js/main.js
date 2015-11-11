window.onload = function() {
  'use strict';
  document.getElementById('search').onclick= function() {src = true; connectedDevices()};
  document.getElementById('stop').onclick= function() {src = false};
  document.getElementById('inpInt').addEventListener('change', function() {checkInterface(this.value)});
  var httpRequest,
      json = {},
      keys,
      src;


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
          }, 1500);
        }
      };
      httpRequest.open('GET', '/status');
      httpRequest.send();
    }
  };
  var inter;
  function checkInterface(nic) {
    inter = new XMLHttpRequest();
    if (!inter) {
      alert('no ajax');
      return false;
    }
    inter.onreadystatechange = function(){
      if (inter.readyState == 4 && inter.status == 200){
        console.log(inter.responseText);
      }
    };
    inter.open('POST', '/interface');
    //inter.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    inter.send(nic);
  };
};
