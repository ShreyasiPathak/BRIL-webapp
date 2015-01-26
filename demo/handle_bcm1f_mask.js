//
// This is a module for faking mask data for the BCM1F detector, for demo purposes.
//
// The mask function creates a structure with four arrays, each with 12 binary values,
// and a made-up name for a tag. Choose this, quite arbitrarily, to be char[32] or so
//
// This code is used by the server, not the client.
//

var fs = require("fs"),
    sqlite3 = require('sqlite3').verbose(),
    bcm1fMaskDB = 'demo/bcm1fMask.db',
    dbExists = fs.existsSync(bcm1fMaskDB),
    db = new sqlite3.Database(bcm1fMaskDB);

if ( dbExists ) {
  console.log("BCM1F mask DB already exists");
} else {
  console.log("Populate BCM1F mask DB");
  db.serialize(function() {
    db.run("CREATE TABLE if not exists mask (detector TEXT, channel INT, masked BOOL)");
    var stmt = db.prepare("INSERT INTO mask VALUES (?,?,?)");
    for (var i = 1; i <= 4; i++) {
      for (var j = 1; j <= 12; j++) {
          stmt.run("BCM1F_" + i, j, false);
      }
    }
    stmt.finalize();
  });

  console.log("Close BCM1F mask DB");
  db.close();
}

module.exports = {
// wrap the function in module.exports{} to make it available to the server
  get: function(request,response) {
    var data = {
//    the four BCM1F detectors, unimaginatively named 1 through 4
      BCM1F_1:[0,0,0,0,0,0,0,0,0,0,0,0],
      BCM1F_2:[0,0,0,0,0,0,0,0,0,0,0,0],
      BCM1F_3:[0,0,0,0,0,0,0,0,0,0,0,0],
      BCM1F_4:[0,0,0,0,0,0,0,0,0,0,0,0],
//    a tag-name for the mask values
      tagName:'BCM1F_tag_2015-01-25'
    };

    db = new sqlite3.Database(bcm1fMaskDB);
    db.serialize(function() {
      db.each("SELECT rowid AS detector, channel, masked FROM mask", function(err, row) {
        logVerbose(row.detector + ", " + row.channel + ", " + row.masked);
        data[row.detector][row.channel] = row.masked;
      });
    });
    db.close();

    logVerbose(JSON.stringify(data));
    response.end(JSON.stringify(data));
    return;
  },

  put: function(request,response) {
//  this sets the mask bits according to the given values.
    var body = ""; // request body
    request.on('data', function(data) {
        body += data.toString();
    });
    request.on('end', function() {
        var mask = JSON.parse(body);

        response.writeHead(200, {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin' : '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
        });
        console.log('Received BCM1F mask: ' + JSON.stringify(mask));

        db = new sqlite3.Database(bcm1fMaskDB);
        db.serialize(function() {
          for ( var det in mask ) {
            for ( var chan in mask[det] ) {
              var masked = mask[det][chan];
              console.log("detector: ",det,", channel: ",chan," mask: ",masked);
              db.each("UPDATE mask SET masked=" + masked + " WHERE detector = '" + det + "' and channel = " + chan);
            }
          }
        });
        db.close();
        response.end('Mask set OK');
    });
  }
};
