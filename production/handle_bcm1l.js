//
// This example shows how to handle the bcm1l data coming from
// http://pc-c2e11-22-01.cms:8845/urn:xdaq-application:lid=16/retrieveCollection?fmt=json&flash=urn:xdaq-flashlist:dipanalyzerMon
//
// it serves data from two paths. One is the url that the web-client
// fetches, the other is a fake source to replace xmas during testing.
//
"use strict";
var http = require('http');
var util = require('util');

var options = {
  // hostname: 'pc-c2e11-22-01.cms',
  // port: '8845',
  // path: '/urn:xdaq-application:lid=16/retrieveCollection?fmt=json&flash=urn:xdaq-flashlist:dipanalyzerMon',
  hostname: config.host,
  port: config.port,
  path: '/get/fake/bcm1l/data',

  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

var getRealData = function(request,response) {

  var req = http.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    if ( res.statusCode != 200 ) {
      response.writeHead(res.statusCode,res.headers);
      response.end(response.text);
    }
    res.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
      response.end(chunk);
    });
  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });
  req.end();
};

var getFakeData = function(request,response) {
  var data = {
   "table" : {
      "definition" : [
         {
            "type" : "string",
            "key" : "context"
         },
         {
            "type" : "string",
            "key" : "lid"
         },
         {
            "type" : "vector float",
            "key" : "PercentAbort1"
         },
         {
            "key" : "TimeLastDump",
            "type" : "unsigned int"
         },
         {
            "type" : "unsigned int",
            "key" : "timestamp"
         }
      ],
      "properties" : {
         "Version" : "1.0",
         "Rows" : 1,
         "LastOriginator" : "http://srv-c2d05-19.cms:50031/urn:xdaq-application:lid=5",
         "Name" : "urn:xdaq-flashlist:dipanalyzerMon",
         "Tag" : "instant",
         "LastUpdate" : "Thu, Mar 12 2015 19:45:08 GMT"
      },
      "rows" : [
         {
            "timestamp" : 0,
            "PercentAbort1" : [
               0.341463,
               1.07317,
               0.439024,
               -1,
               0.536585,
               0.536585,
               0.390244,
               0.439024,
               -1,
               -1,
               -1,
               -1,
               -1,
               -1,
               -1,
               -1,
               0.0677507,
               0.0677507,
               2.32831e-08,
               2.32831e-08,
               4.65661e-08,
               2.32831e-08,
               2.32831e-08,
               2.32831e-08,
               0.0677507,
               0.0677507,
               2.32831e-08,
               2.32831e-08,
               2.32831e-08,
               2.32831e-08,
               2.32831e-08,
               2.32831e-08,
               0.0487805,
               0.0487805,
               2.32831e-08,
               2.32831e-08,
               2.32831e-08,
               2.32831e-08,
               2.32831e-08,
               2.32831e-08,
               0.0487805,
               0.097561,
               4.65661e-08,
               4.65661e-08,
               2.32831e-08,
               2.32831e-08,
               2.32831e-08,
               2.32831e-08
            ],
            "lid" : "102",
            "context" : "http://srv-c2d05-19.cms:50031",
            "TimeLastDump" : 0
         }
      ]
    }
  };
  response.writeHead(200,{
    "Content-type":  "application/json",
    "Cache-control": "max-age=0"
  });
  response.end(JSON.stringify(data));
};

module.exports = {
  get: function(request,response) {
    var data;
    if ( request.url === "/get/bcm1l/data" ) {
      console.log(now(),"Get bcm1l data from xmas");
      getRealData(request,response);
    } else if ( request.url === "/get/fake/bcm1l/data" ) {
      getFakeData(request,response);
      console.log(now(),"Serve bcm1l fake data");
    } else {
      console.log(now(),"How the heck did I get here???");
    }
  },
  path: [ "/get/bcm1l/data", "/get/fake/bcm1l/data" ] // Set this path correctly
};

