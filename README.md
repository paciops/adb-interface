# adb-interface
this application needs of **node.js** and **adb** installed. [see more.](https://github.com/openstf/adbkit#requirements)
 
tested only on linux

adb-interface is express.js server that with your android device using the Android Debug Bridge.

You can manage the server with an HTML page.

- HTML
- CSS
- JavaScript
- Node.JS

# how to
```
git clone https://github.com/paciops/adb-interface.git && cd adb-interface/
npm install && npm start
go on --> http://localhost:8080
```
**for debugging**
`DEBUG=express npm start`

![test-img](/readme/cmd.png)

# how it works
the HTML interface send requests to the express.js server that use [adbkit](https://github.com/openstf/adbkit), a framework that allow to comunicate with adb so with android.
![test-img](/readme/eth0.png)

![test-img](/readme/wlan0.png)
