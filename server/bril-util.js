"use strict";
var http = require("http"),
    util = require("util");

var gaussian1 = function(x1,x2,mean,sigma) {
    var z = Math.sqrt(-2 * Math.log(x1)) * Math.cos( 2 * Math.PI * x2 );
    return Math.round(mean + sigma * z);
  },
  gaussian2 = function(x1,x2,mean,sigma) {
    var z = Math.sqrt(-2 * Math.log(x1)) * Math.sin( 2 * Math.PI * x2 );
    return Math.round(mean + sigma * z);
  };

module.exports = {
//
// generate gaussian random numbers, approximated by a Box-Muller transform
//
  gaussian: function(mean,sigma,N) {
    var data = [], u1, u2;
    for ( var i=0; i<Math.floor(N/2); i++ ) {
      u1 = Math.random();
      u2 = Math.random();
      data.push(gaussian1(u1,u2,mean,sigma));
      data.push(gaussian2(u1,u2,mean,sigma));
    }
    if ( N%2 ) { // add one more value
      u1 = Math.random();
      u2 = Math.random();
      data.push(gaussian1(u1,u2,mean,sigma));
    }
    return data;
  },

//
// Current time (or a time you specify), formatted nicely
//
  now: function(date) {
    if ( !date ) { date = new Date(); }
    var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
              date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":";
    return str;
  },

//
// Generic function for fetching data from a URL, parsing the result,
// and returning it to the caller.
//
// Used to get data from xmas or from the fake data handlers built into the server
//
  getData: function(options,request,response,parseData) {
    var req = http.request(options, function(res) {
      logVerbose(req.path,'Status: ' + res.statusCode);
      logVerbose(req.path,'Headers: ' + JSON.stringify(res.headers));
      if ( res.statusCode !== 200 ) {
        response.writeHead(res.statusCode,res.headers);
        response.end(response.text);
      }
      res.on('data', function (chunk) {
        logVerbose(req.path,'Body: ' + chunk);
        if ( parseData ) {
          var data = JSON.parse(chunk);
          data = parseData(data);
          chunk = JSON.stringify(data);
        }
        response.end(chunk);
      });
    });

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });
    req.end();
  }
};