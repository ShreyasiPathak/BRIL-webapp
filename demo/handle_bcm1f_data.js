//
// This is a module for faking data for the BCM1F detector, for demo purposes.
//
// The 'getData' function creates a structure with four arrays, each with 12 values
// which are drawn from a gaussian, approximated by a Box-Muller transform
//
// getRunNumber should get the run number (astonishing, isn't it!)
// and getTimeStamp should return an appropriate timestamp (epoch milliseconds)
//
var mean = 100, sigma = 10; // parameters of the gaussian
var gaussian1 = function(x1,x2) {
  z = Math.sqrt(-2 * Math.log(x1)) * Math.cos( 2 * Math.PI * x2 );
  return(Math.round(mean + sigma * z));
}
var gaussian2 = function(x1,x2) {
  z = Math.sqrt(-2 * Math.log(x1)) * Math.sin( 2 * Math.PI * x2 );
  return(Math.round(mean + sigma * z));
}

var getData = function() {
  var i, data = {
// the four BCM1F detectors, unimaginatively named 1 through 4
    BCM1F_1:[],
    BCM1F_2:[],
    BCM1F_3:[],
    BCM1F_4:[]
  };
  for ( i=0; i<6; i++ ) {
    u1 = Math.random(); u2 = Math.random();
    data.BCM1F_1.push(gaussian1(u1,u2));
    data.BCM1F_1.push(gaussian2(u1,u2));
  }
  for ( i=0; i<6; i++ ) {
    u1 = Math.random(); u2 = Math.random();
    data.BCM1F_2.push(gaussian1(u1,u2));
    data.BCM1F_2.push(gaussian2(u1,u2));
  }
  for ( i=0; i<6; i++ ) {
    u1 = Math.random(); u2 = Math.random();
    data.BCM1F_3.push(gaussian1(u1,u2));
    data.BCM1F_3.push(gaussian2(u1,u2));
  }
  for ( i=0; i<6; i++ ) {
    u1 = Math.random(); u2 = Math.random();
    data.BCM1F_4.push(gaussian1(u1,u2));
    data.BCM1F_4.push(gaussian2(u1,u2));
  }
  return(data);
};

module.exports = {
  get: function(response) {
    response.writeHead(200,{
        "Content-type":  "application/json",
        "Cache-control": "max-age=0"
      });
    var res = { // fake data generated here...
      data: getData(),
      runNumber: 1234567,
      timestamp: (new Date).getTime()
    };
    logVerbose(JSON.stringify(res));
    response.end(JSON.stringify(res));
}
};
