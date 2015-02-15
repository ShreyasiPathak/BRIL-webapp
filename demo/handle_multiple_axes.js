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

var getData = function() {
//
// This example simply creates an array with 1000 values drawn from a gaussian,
//
  var data = {
    rainfall: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
    sea_level_pressure: [1016, 1016, 1015.9, 1015.5, 1012.3, 1009.5, 1009.6, 1010.2, 1013.1, 1016.9, 1018.2, 1016.7],
    temperature: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
  };
  var i, k=0, n=12, noise = u.gaussian(1000,50,3*n);
  for (i=0; i<3*n; i++) { noise[i] /= 1000; }
  for (i=0; i<n; i++) {
    data.rainfall[i]           = Math.round(data.rainfall[i]           * noise[k++]);
    data.sea_level_pressure[i] = Math.round(data.sea_level_pressure[i] * (noise[k++]+99)/100);
    data.temperature[i]        = Math.round(data.temperature[i]        * noise[k++]);
  }
  return data;
};

module.exports = {
  get: function(request,response) {
    response.writeHead(200,{
        "Content-type":  "application/json",
        "Cache-control": "max-age=0"
      });
    var res = {
      data: getData()
    };
    logVerbose(now(),JSON.stringify(res));
    response.end(JSON.stringify(res));
  },
  path: [ "/get/multiple_axes/data" ] // Set this path correctly
};
