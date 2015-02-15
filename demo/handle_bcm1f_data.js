//
// This is a module for faking data for the BCM1F detector, for demo purposes.
//
"use strict";
var u = require("./util");

//
// The 'getData' function creates a structure with four arrays, each with 12 values.
// These are drawn from a gaussian, just for the sake of having interesting data
var getData = function() {
  var i, data = {},
    detectors = [ "BCM1F_1", "BCM1F_2", "BCM1F_3", "BCM1F_4" ];
  for ( i=0; i<detectors.length; i++ ) {
    data[detectors[i]] = u.gaussian(100,10,12); // mean, sigma, count
  }
  console.log(u.now(),data);
  return data;
};

module.exports = {
  get: function(request,response) {
    response.writeHead(200,{
        "Content-type":  "application/json",
        "Cache-control": "max-age=0"
      });
    var res = { // fake data generated here...
      data: getData(),
      runNumber: 1234567,
      timestamp: (new Date()).getTime()
    };
    // logVerbose(now(),JSON.stringify(res));
    response.end(JSON.stringify(res));
  },
  path: [ "/get/bcm1f/data" ]
};
