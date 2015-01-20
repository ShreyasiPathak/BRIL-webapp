//
// Start by including the demo assistant functions
//
// Replace the code in these functions by whatever you need
// to get data from the real data sources
//
var getData = require("./demo/get_data");
var getMask = require("./demo/get_mask");

// Now the server proper
var http = require("http");
var fs = require("fs");
console.log("Starting:");

var config, configFile="./config.json";
var logVerbose;

readConfig = function() {
  var contents = fs.readFileSync(configFile);
  console.log("Config file ",configFile," read");

  config = JSON.parse(contents);
  config.verbose = parseInt(config.verbose);
  if ( config.verbose ) {
    logVerbose = function() { console.log(arguments); }
  } else {
    logVerbose = function() {};
  }

  console.log("Config: Host and port: ", config.host, ":", config.port);
  console.log("Config: Verbosity: ", config.verbose);
  console.log("Config: Logfile: ", config.logfile)
}

// create the server, and define the handler for all valid URLs
var server = http.createServer( function(request,response) {
  console.log("Received request: " + request.url);

  if ( request.url == "/put/mask" ) {
    console.log("Got a request to put a mask: Don't know how to do that yet!");
    response.writeHead(200,{
          "Content-type":  "text/plain",
          "Cache-control": "max-age=0"
        });
    request.on("data", function (chunk) {
        console.log("Got channel mask: "+ chunk);
    });
    response.end("Got mask data OK");
    logVerbose("Send PUT response");
    return;
  }

  if ( request.url == "/get/data" ) {
    console.log("Got a request for data");
    response.writeHead(200,{
          "Content-type":  "application/json",
          "Cache-control": "max-age=0"
        });
    var res = {
      data: getData.randomData(),
      runNumber: getData.runNumber(),
      timestamp: getData.timeStamp()
    };
    logVerbose(JSON.stringify(res));
    response.end(JSON.stringify(res));
    return;
  }

  if ( request.url == "/quit" ) {
    console.log("Got a request to quit: Outta here...");
    response.writeHead(200,{"Content-type":"text/plain"});
    response.end("Server exiting at your request");
    server.close();
    process.exit(0);
  }

  var file = request.url;
  if ( file == "/" ) {
    console.log("Got a request for /");
    file = "/index.html";
  }

  fs.readFile("./app" + file,function(error,data) {
    if ( error ) {
      console.log("Error reading ./app"+file+": "+error);
      response.writeHead(404,{"Content-type":"text/plain"});
      response.end("Sorry, page not found<br>");
    } else {
      if ( request.headers["if-modified-since"] ) {
        var imstime, mtime;
        imstime = new Date(request.headers["if-modified-since"]).getTime();
        mtime   = new Date(fs.statSync("./app"+file).mtime);
        if ( mtime ) { mtime = mtime.getTime(); }
        else         { mtime = 9999999999; }
        if ( imstime >= mtime ) {
          logVerbose("Not modified: ./app"+file);
          response.writeHead(304);
          response.end();
          return;
        }
      }
      logVerbose("Sending ./app"+file);
      var type;
      if      ( file.match(/.html$/) ) { type = "text/html"; }
      else if ( file.match(/.css$/) )  { type = "text/css"; }
      else if ( file.match(/.js$/) )   { type = "application/javascript"; }
      response.setHeader("Content-type",  type);
      response.setHeader("Cache-control", "max-age=3600");
      response.setHeader("Last-modified", mtime);
      response.writeHead(200);
      response.end(data);
    }
  })
});

readConfig();
fs.watchFile(configFile, function(current, previous) {
  console.log("Config changed");
  readConfig();
});

server.listen(config.port,config.host,function() {
  console.log("Listening on " + config.host + ":" + config.port);
})
// server.close();