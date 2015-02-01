//
// This is a module for faking data for the OTHER2 detector, for demo purposes.
//
// The 'getData' function creates a structure with an array with 5000 values
// drawn from a gaussian (approximated by a Box-Muller transform), but modulated
// to look more interesting
//
var mean = 1000, sigma = 10; // parameters of the gaussian
var gaussian1 = function(x1,x2,mean,sigma) {
  z = Math.sqrt(-2 * Math.log(x1)) * Math.cos( 2 * Math.PI * x2 );
  return(Math.round(mean + sigma * z));
}
var gaussian2 = function(x1,x2,mean,sigma) {
  z = Math.sqrt(-2 * Math.log(x1)) * Math.sin( 2 * Math.PI * x2 );
  return(Math.round(mean + sigma * z));
}

var getData = function() {
  console.log("other2 getData");
  var i, data = {
    OTHER2:[]
  };
  var dips = 100;
  for ( i=0; i<1000; i++ ) {
    var u1 = Math.random(),
        u2 = Math.random(),
        v1 = gaussian1(u1,u2,mean,sigma),
        v2 = gaussian2(u1,u2,mean,sigma);
    if ( i%dips < 5 ) {
      v1 = v1 * i%dips / 5;
      v2 = v2 * i%dips / 5;
    }
    data.OTHER2.push(v1);
    data.OTHER2.push(v2);
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
      // runNumber: 1234567,
      timestamp: (new Date).getTime()
    };
    logVerbose(JSON.stringify(res));
    response.end(JSON.stringify(res));
  }
};
