//
// This is a module for faking mask data for the BCM1F detector, for demo purposes.
//
// The mask function creates a structure with four arrays, each with 12 binary values,
// and a made-up name for a tag. Choose this, quite arbitrarily, to be char[32] or so
//
// This code is used by the server, not the client.
//

var fs = require("fs");

var bcm1fMaskDB = 'demo/bcm1fMask.db';
if (fs.existsSync(bcm1fMaskDB)) {
  console.log("BCM1F mask DB already exists");
} else {
  console.log("Create BCM1F mask DB");
  var sqlite3 = require('sqlite3').verbose();
  var db = new sqlite3.Database(bcm1fMaskDB);
  // var check;
  console.log("Populate BCM1F mask DB");
  db.serialize(function() {

    db.run("CREATE TABLE if not exists mask (detector TEXT, channel INT, masked BOOL)");
    var stmt = db.prepare("INSERT INTO mask VALUES (?,?,?)");
    for (var i = 1; i <= 4; i++) {
      for (var j = 1; j <= 12; j++) {
          stmt.run("D" + i, j, false);
      }
    }
    stmt.finalize();

    // db.each("SELECT rowid AS id, detector, channel, masked FROM mask", function(err, row) {
    //     console.log(row.id + ": " + row.detector + ", " + row.channel + ", " + row.masked);
    // });
  });

  console.log("Close BCM1F mask DB");
  db.close();
}

module.exports = {
// wrap the function in module.exports{} to make it available to the server
  mask: function() {
    var data = {
//    the four BCM1F detectors, unimaginatively named 1 through 4
      BCM1F_1:[0,0,0,0,0,0,0,0,0,0,0,0],
      BCM1F_2:[0,0,0,0,0,0,0,0,0,0,0,0],
      BCM1F_3:[0,0,0,0,0,0,0,0,0,0,0,0],
      BCM1F_4:[0,0,0,0,0,0,0,0,0,0,0,0],
//    a tag-name for the mask values
      tagName:'BCM1F_tag_2015-01-25'
    };

    db.serialize(function() {
      db.each("SELECT rowid AS id, detector, channel, masked FROM mask", function(err, row) {
        console.log(row.id + ": " + row.detector + ", " + row.channel + ", " + row.masked);
      });
    });

    return(data);
  },

  put: function(request,response) {
//  this should set the mask bits according to the given values.
    response.writeHead(200,{
      "Content-type":  "text/plain",
      "Cache-control": "max-age=0"
    });
//  receive and log the data
    request.on("data", function (chunk) {
        console.log("Got channel mask: "+ chunk);
    });
    response.end("Got mask data OK");
    // bcm1fMask.set(data);
    logVerbose("Send PUT response");
  }
};
