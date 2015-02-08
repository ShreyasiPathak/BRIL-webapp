//
// This is a module for faking data for the Zoomable Time-series chart, for demo purposes.
//
var u = require("./util");

var getData = function() {
//
// Create a structure with an array with 5000 values drawn from a gaussian,
// but modulated to look more interesting
//
  var i, j, data = {
    ZTS:[]
  }, N=1000;
  var dips=100, width=10;
  data.ZTS = u.gaussian(1000,10,N)
  for ( i=0; i<N+width; i+=dips ) {
    for ( j=0; j<width; j++ ) {
      data.ZTS[i+j] *= (j%width)/width;
    }
  }
  return(data);
};

module.exports = {
  get: function(request,response) {
    response.writeHead(200,{
        "Content-type":  "application/json",
        "Cache-control": "max-age=0"
      });
    var res = { // fake data
      data: getData(),
      timestamp: (new Date).getTime()
    };
    logVerbose(now(),JSON.stringify(res));
    response.end(JSON.stringify(res));
  },
  path: [ "/get/zoomable_time_series/data" ]
};
