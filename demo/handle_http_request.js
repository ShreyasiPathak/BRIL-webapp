//
// This is a module for faking data for demo purposes.
//
// The only parts you need to change are the data structure ('var data'), so it
// looks like your real data, and the 'path' at the bottom, in which you change
// 'my_view' to the same value you used in the app/js directory.
//
// The rest is boilerplate, you shouldn't need to touch it
//
"use strict";
var u = require("./util");
var http = require('http');

var getData = function(response) {
//
// This example simply creates an array with 1000 values drawn from a gaussian,
//
  var options = {
    host: 'cmsonline.cern.ch',
    path: '/dimConnectivity/mobileDipBrowser.do?item=dip%2FCMS%2FBRIL%2FBCMAnalysis%2FAcquisition&t=1424189168239'
  };
  var request = http.request(options, function (res) {
    var data = '';
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on('end', function () {
      logVerbose(now(),data);
      response.end(data);
    });
  });
  request.on('error', function (e) {
    console.log(e.message);
  });
  request.end();
};

module.exports = {
  get: function(request,response) {
    response.writeHead(200,{
        "Content-type":  "application/json",
        "Cache-control": "max-age=0"
      });
    getData(response);
  },
  path: [ "/get/http_request/data" ] // Set this path correctly
};
