//
// This example shows how to handle the bcm1l data
//
"use strict";
var http = require('http'),
    util = require('../server/bril-util');

//
// 'me' is used in several places, to define the URL that will serve your data,
// (/get/"me"/data) and in output to the logfile.
//
var me = 'bcm1l';

//
// The "options" object defines how to contact your data-source. Change the
// hostname/port/path as appropriate.
//
// You can also define the HTTP method and content-type, but these should
// not normally need to be changed.
//
var options = {
  hostname: 'pc-c2e11-22-01.cms',
  port: '8845',
  path: '/urn:xdaq-application:lid=16/retrieveCollection?fmt=json&flash=urn:xdaq-flashlist:dipanalyzerMon',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

var getFakeData = function() {
//
// The data structure here is taken directly from xmas and cut/pasted into the code.
// This lets me test getting/parsing data independently of access to xmas, e.g. while
// I'm away from the CMS online world or if the DAQ is down for any reason.
//
  var data = {
   "table" : {
      "definition" : [
         {  "type" : "string",        "key" : "context" },
         {  "type" : "string",        "key" : "lid" },
         {  "type" : "vector float",  "key" : "PercentAbort1" },
         {  "type" : "unsigned int",  "key" : "TimeLastDump" },
         {  "type" : "unsigned int",  "key" : "timestamp" }
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
               0.341463,  1.07317,   0.439024,   -1,           0.536585,    0.536585,    0.390244,    0.439024,
              -1,        -1,        -1,          -1,          -1,          -1,          -1,          -1,
               0.0677507, 0.0677507, 2.32831e-08, 2.32831e-08, 4.65661e-08, 2.32831e-08, 2.32831e-08, 2.32831e-08,
               0.0677507, 0.0677507, 2.32831e-08, 2.32831e-08, 2.32831e-08, 2.32831e-08, 2.32831e-08, 2.32831e-08,
               0.0487805, 0.0487805, 2.32831e-08, 2.32831e-08, 2.32831e-08, 2.32831e-08, 2.32831e-08, 2.32831e-08,
               0.0487805, 0.097561,  4.65661e-08, 4.65661e-08, 2.32831e-08, 2.32831e-08, 2.32831e-08, 2.32831e-08
            ],
            "lid" : "102",
            "context" : "http://srv-c2d05-19.cms:50031",
            "TimeLastDump" : 0
         }
      ]
    }
  };

//
// Throw in a little randomness to make the data change with every request.
// Then you can see that your visualisation updates when you reload the page.
//
// The rule is that you can modify _values_ here, but not _structure_. Anything
// that needs to be modified in the structure should be handled by the parseData
// function, below. Otherwise this fake data is not properly formatted as if it
// really came from xmas!
//
  var rows = data.table.rows;
  for ( var i in rows ) {
    var pa1 = rows[i].PercentAbort1;
    for ( var j in pa1 ) {
      if ( pa1[j] > 0.001 ) { pa1[j] = pa1[j] * (Math.random()-0.5)/10; }
    }
  }
  return data;
};

module.exports = {
  me: me,

//
// The 'get' function won't need changing, it's standard
//
  get: function(request,response) {
    if ( global.config.fakedata ) {
      logVerbose(now(),'Serve ' + me + ' fake data');
      response.writeHead(200,{
        "Content-type":  "application/json",
        "Cache-control": "max-age=0"
      });
      response.end( JSON.stringify( this.parseData( getFakeData() ) ) );
    } else if ( request.url === '/get/' + me + '/data' ) {
      logVerbose(now(),'Get ' + me + ' data from xmas');
      util.getData(options,request,response,this);
    } else {
      console.log(now(),me,": How the heck did I get here???");
    }
  },

//
// The 'parseData' function takes the raw JSON object from xmas and does
// whatever is needed to transform it into something usable by the client
// application. Typically this means making a data-structure which can be
// fed directly to a Highcharts plotting function.
//
// In this case, the data structure contains a date as a string. Parse it
// to an epoch time, which in JavaScript means milliseconds since 01/01/1970.
//
// It's also worth pruning away stuff you don't need in the browser. It just
// wastes bandwidth and CPU to encode, send and parse it.
//
  parseData: function(data) {
    var table=data.table, newdata={};
    newdata.timestamp = new Date(table.properties.LastUpdate).getTime();
    newdata.tag = table.properties.Tag;
    newdata.data = [];
    for ( var i in table.rows ) {
      newdata.data.push(table.rows[i].PercentAbort1);
    }
    return newdata;
  },

  path: [ '/get/' + me + '/data', '/get/fake/' + me + '/data' ]
};
