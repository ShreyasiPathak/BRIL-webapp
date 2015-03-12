//
// This is a module for faking data for a Basic Area plot, for demo purposes.
//
"use strict";
var u = require("../server/bril-util");

var getData = function() {
//
// Create a structure with two arrays, each with 50 values. The values are gaussian
// around a rising/falling line, just to make them separate on the screen for more
// visual interest
//
  var i, data = {
    BASIC_AREA_1:[],
    BASIC_AREA_2:[]
  }, N=50;

  data.BASIC_AREA_1 = u.gaussian(100,10,N);
  for ( i=0; i<N; i++ ) { data.BASIC_AREA_1[i] *= i/N; }
  data.BASIC_AREA_2 = u.gaussian(120,10,N);
  for ( i=0; i<N; i++ ) { data.BASIC_AREA_2[i] *= (N-i)/N; }

  return data;
};

module.exports = {
  get: function(request,response) {
    response.writeHead(200,{
        "Content-type":  "application/json",
        "Cache-control": "max-age=0"
      });
    var res = { // fake data
      data: getData(),
      timestamp: (new Date()).getTime()
    };
    logVerbose(JSON.stringify(res));
    response.end(JSON.stringify(res));
  },
  path: [ "/get/basic_area/data" ]
};
