//
// This is a module for faking data for demonstrating a basic line graph.
//
"use strict";
var u = require("../server/bril-util");

var getData = function() {
//
// This example creates an array of numbers with added noise drawn from a gaussian,
//
  var data = {
    line_graph:[7.0,6.9,9.5,14.5,18.2,21.5,25.2,26.5,23.3,18.3,13.9,9.6]
  };
  var noise = u.gaussian(0,10,data.line_graph.length); // that's (mean, sigma, Npoints)
  for ( var i=0; i<data.line_graph.length; i++ ) {
    data.line_graph[i] += noise[i]/10;
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
  path: [ "/get/line_graph/data" ] // Set this path correctly
};
