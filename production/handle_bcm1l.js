//
// This example shows how to handle the bcm1l data coming from
// http://pc-c2e11-22-01.cms:8845/urn:xdaq-application:lid=16/retrieveCollection?fmt=json&flash=urn:xdaq-flashlist:dipanalyzerMon
//
// The only parts you need to change are the data structure ('var data'), so it
// looks like your real data, and the 'path' at the bottom, in which you change
// 'my_view' to the same value you used in the app/js directory.
//
// The rest is boilerplate, you shouldn't need to touch it
//
"use strict";
var u = require("../server/bril-util");
var http = require('http');

var options = {
  hostname: 'www.wildish.eu', // 'http://pc-c2e11-22-01.cms:8845/urn:xdaq-application:lid=16/retrieveCollection?fmt=json&flash=urn:xdaq-flashlist:dipanalyzerMon',
  port: 80,
  path: '/',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

var getData = function(response) {
  var data;

  http.get(options,
    function(res) {
    response.writeHead(200,{
        "Content-type":  "application/json",
        "Cache-control": "max-age=0"
      });
    console.log("Got response: " + res.statusCode);
    logVerbose(now(),JSON.stringify(res));
    response.end(JSON.stringify(res));
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
    logVerbose(now(),JSON.stringify(res));
    response.end(JSON.stringify(res));
  });
  console.log("Getting data...");
};

module.exports = {
  get: function(request,response) {
    console.log("In BCM1l/get");
    data: getData(response);
  },
  path: [ "/get/bcm1l/data" ] // Set this path correctly
};

