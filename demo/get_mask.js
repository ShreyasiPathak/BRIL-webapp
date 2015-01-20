//
// This is a module for faking mask data for the BCM1F detector, for demo purposes.
//
// The mask function creates a structure with four arrays, each with 12 binary values
//

module.exports = {
  mask: function() {
    var data = {
//    the four BCM1F detectors, unimaginatively named 1 through 4
      BCM1F_1:[0,0,0,0,0,0,0,0,0,0,0,0],
      BCM1F_2:[0,0,0,0,0,0,0,0,0,0,0,0],
      BCM1F_3:[0,0,0,0,0,0,0,0,0,0,0,0],
      BCM1F_4:[0,0,0,0,0,0,0,0,0,0,0,0]
    };
    return(data);
  }
};
