//
// This is a module for faking data for demo purposes.
//
// The only parts you need to change are the data structure ('var data'), so it
// looks like your real data, and the 'path' at the bottom, in which you change
// 'my_view' to the same value you used in the app/js directory.
//
// The rest is boilerplate, you shouldn't need to touch it
//
var u = require("./util");

var getData = function() {
//
// This example simply creates an array with 1000 values drawn from a gaussian,
//
  var data = {
    line_graph:[7.0,6.9,9.5,14.5,18.2,21.5,25.2,26.5,23.3,18.3,13.9,9.6]
  };
  var noise = u.gaussian(0,10,data.line_graph.length) // that's (mean, sigma, Npoints)
  for ( var i=0; i<data.line_graph.length; i++ ) {
    data.line_graph[i] += noise[i]/10;
  }
  return(data);
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
