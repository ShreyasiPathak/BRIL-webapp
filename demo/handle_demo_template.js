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
    my_view: u.gaussian(1000,10,1000) // that's (mean, sigma, Npoints)
  };
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
  path: [ "/get/my_view/data" ] // Set this path correctly
};
