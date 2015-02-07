//
// This is a module for faking data for the OTHER1 detector, for demo purposes.
//
var u = require("./util");

var getData = function() {
//
// Create a structure with two arrays, each with 50 values. The values are gaussian
// around a rising/falling line, just to make them separate on the screen for more
// visual interest
//
  var i, data = {
    OTHER1_1:[],
    OTHER1_2:[]
  }, N=50;

  data.OTHER1_1 = u.gaussian(100,10,N);
  for ( i=0; i<N; i++ ) {
    data.OTHER1_1[i] *= i/N;
  }
  data.OTHER1_2 = u.gaussian(120,10,N);
  for ( i=0; i<N; i++ ) {
    data.OTHER1_2[i] *= (N-i)/N;
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
    logVerbose(JSON.stringify(res));
    response.end(JSON.stringify(res));
  },
  path: [ "/get/other1/data" ]
};
