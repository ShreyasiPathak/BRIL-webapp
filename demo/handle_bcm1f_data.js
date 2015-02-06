//
// This is a module for faking data for the BCM1F detector, for demo purposes.
//
// The 'getData' function creates a structure with four arrays, each with 12 values
// which are drawn from a gaussian, approximated by a Box-Muller transform
//
var gaussian1 = function(x1,x2,mean,sigma) {
  z = Math.sqrt(-2 * Math.log(x1)) * Math.cos( 2 * Math.PI * x2 );
  return(Math.round(mean + sigma * z));
}
var gaussian2 = function(x1,x2,mean,sigma) {
  z = Math.sqrt(-2 * Math.log(x1)) * Math.sin( 2 * Math.PI * x2 );
  return(Math.round(mean + sigma * z));
}

var getData = function() {
  var i, data = {},
    detectors = [ "BCM1F_1", "BCM1F_2", "BCM1F_3", "BCM1F_4" ];
  for ( i=0; i<detectors.length; i++ ) {
    data[detectors[i]] = [];
    for ( j=0; j<6; j++ ) {
      var u1 = Math.random(), u2 = Math.random();
      data[detectors[i]].push(gaussian1(u1,u2,100,10));
      data[detectors[i]].push(gaussian2(u1,u2,100,10));
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
    var res = { // fake data generated here...
      data: getData(),
      runNumber: 1234567,
      timestamp: (new Date).getTime()
    };
    logVerbose(now(),JSON.stringify(res));
    response.end(JSON.stringify(res));
  },
  path: [ "/get/bcm1f/data" ]
};
