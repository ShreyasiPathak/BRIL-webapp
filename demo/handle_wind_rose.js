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
    wind_rose: [
      [ null, ">&lt; 0.5 m/s", ">0.5-2 m/s", ">2-4 m/s", ">4-6 m/s", ">6-8 m/s", ">8-10 m/s", ">&gt; 10 m/s" ],
      [ "N",   1.81, 1.78, 0.16, 0.00, 0.00, 0.00, 0.00 ],
      [ "NNE", 0.62, 1.09, 0.00, 0.00, 0.00, 0.00, 0.00 ],
      [ "NE",  0.82, 0.82, 0.07, 0.00, 0.00, 0.00, 0.00 ],
      [ "ENE", 0.59, 1.22, 0.07, 0.00, 0.00, 0.00, 0.00 ],
      [ "E",   0.62, 2.20, 0.49, 0.00, 0.00, 0.00, 0.00 ],
      [ "ESE", 1.22, 2.01, 1.55, 0.30, 0.13, 0.00, 0.00 ],
      [ "SE",  1.61, 3.06, 2.37, 2.14, 1.74, 0.39, 0.13 ],
      [ "SSE", 2.04, 3.42, 1.97, 0.86, 0.53, 0.49, 0.00 ],
      [ "S",   2.66, 4.74, 0.43, 0.00, 0.00, 0.00, 0.00 ],
      [ "SSW", 2.96, 4.14, 0.26, 0.00, 0.00, 0.00, 0.00 ],
      [ "SW",  2.53, 4.01, 1.22, 0.49, 0.13, 0.00, 0.00 ],
      [ "WSW", 1.97, 2.66, 1.97, 0.79, 0.30, 0.00, 0.00 ],
      [ "W",   1.64, 1.71, 0.92, 1.45, 0.26, 0.10, 0.00 ],
      [ "WNW", 1.32, 2.40, 0.99, 1.61, 0.33, 0.00, 0.00 ],
      [ "NW",  1.58, 4.28, 1.28, 0.76, 0.66, 0.69, 0.03 ],
      [ "NNW", 1.51, 5.00, 1.32, 0.13, 0.23, 0.13, 0.07 ]
    ]
  };
  var noise = u.gaussian(10,3,7*16);
  var k=0;
  for (var i=1; i<17; i++) {
    for (var j=1; j<8; j++) {
      console.log("data[",i,",",j,"] = ",data.wind_rose[i][j]);
      data.wind_rose[i][j] += noise[k++]/10;
    }
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
  path: [ "/get/wind_rose/data" ] // Set this path correctly
};
