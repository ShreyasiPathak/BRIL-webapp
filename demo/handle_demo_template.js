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
var http = require('http'),
    util = require('../server/bril-util');

//
// 'me' is used in several places, to define the URL that will serve your data,
// (/get/"me"/data) and in output to the logfile. Keep it short and simple, no
// embedded spaces etc.
//
var me = 'my_name';

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
// The data structure here should be taken directly from xmas and cut/pasted into the code.
// This lets me test getting/parsing data independently of access to xmas, e.g. while
// I'm away from the CMS online world or if the DAQ is down for any reason.
//
// For a working example, check the code in handle_bcm1l.js
//
// This trivial example simply creates an array with 1000 values drawn from a gaussian,
//
  var data = {
    my_view: util.gaussian(1000,10,1000) // that's (mean, sigma, Npoints)
  };
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
// In this case, there's nothing to do, so parseData is empty. For a more
// complete example, look in the handle_bcm1l.js code.
//
// It's also worth pruning away stuff you won't need in the browser. It just
// wastes bandwidth and CPU to encode, send and parse it.
//
  parseData: function(data) {
    return data;
  },

//
// This array lists the URLs that the module will respond to.
//
// The naming convention is '/method/module-name/data' for real data, where
// 'method' is the HTTP method allowed here. Normally this will be 'get',
// but it can also be 'put' if data can be uploaded, as in the case of the
// bcm1f mask data.
// the module-name is taken from what you defined at the top of this file, and
// the trailing '/data' is just for fun.
//
  path: [ '/get/' + me + '/data', '/get/fake/' + me + '/data' ]
};
