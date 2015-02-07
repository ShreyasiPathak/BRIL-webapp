//
// This is a module for faking data for the OTHER2 detector, for demo purposes.
//
var u = require("./util");

var getData = function() {
//
// Create a structure with an array with 5000 values drawn from a gaussian,
// but modulated to look more interesting
//
  var i, j, data = {
    OTHER2:[]
  }, N=1000;
  var dips=100, width=10;
  data.OTHER2 = u.gaussian(1000,10,N)
  for ( i=0; i<N+width; i+=dips ) {
    for ( j=0; j<width; j++ ) {
      data.OTHER2[i+j] *= (j%width)/width;
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
  path: [ "/get/other2/data" ]
};
