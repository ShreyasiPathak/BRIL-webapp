//
// Start by including the demo assistant functions
//
// Replace the code in these functions by whatever you need
// to get data from the real data sources
//
var config, configFile="./config.json",
    logVerbose,
    logVerboseReal=function() {
      console.log(arguments);
    }; // define here for use in included files
global.logVerbose = logVerbose = logVerboseReal;
var bcm1fData  = require("./demo/handle_bcm1f_data");
var bcm1fMask  = require("./demo/handle_bcm1f_mask");
var other1Data = require("./demo/handle_other1_data");
var other2Data = require("./demo/handle_other2_data");

// Now the server proper
var http = require("http"),
    fs   = require("fs"); // used for watching the config file for changes
console.log("Starting:");

// create the server, and define the handler for all valid URLs
var server = http.createServer( function(request,response) {
  console.log("Received request: " + request.url);

//
// This is a series of 'switch' statements to handle the individual cases.
// Add new cases here as necessary. Be sure to 'return' from each case
// unless you want deliberate fall-through to the next block of code, in
// which case you should document it.
//

//
// BCM1F data & mask handling
  if ( request.url == "/put/bcm1f/mask" ) {
    console.log("Got a request to put the BCM1F mask");
    bcm1fMask.put(request,response);
    return;
  }
  if ( request.url == "/get/bcm1f/mask" ) {
    console.log("Got a request for the BCM1F mask");
    bcm1fMask.get(request,response);
    return;
  }
  if ( request.url == "/get/bcm1f/data" ) {
    console.log("Got a request for the BCM1F data");
    bcm1fData.get(request,response);
    return;
  }

//
// OTHER1 handling
  if ( request.url == "/get/other1/data" ) {
    console.log("Got a request for the OTHER1 data");
    other1Data.get(request,response);
    return;
  }

//
// OTHER2 handling
  if ( request.url == "/get/other2/data" ) {
    console.log("Got a request for the OTHER2 data");
    other2Data.get(request,response);
    return;
  }

//
// tell the server to quit, in case you'd ever want to do that...
//
  if ( request.url == "/quit" ) {
    console.log("Got a request to quit: Outta here...");
    response.writeHead(200,{"Content-type":"text/plain"});
    response.end("Server exiting at your request");
    server.close();
    process.exit(0);
  }

//
// From here down is standard HTML server stuff, not related to
// the BRIL application as such
//

//
// Redirect a request for '/' to the main application HTML file.
// This then falls-through to the rest of the application
//
  var file = request.url;
  if ( file == "/" ) {
    logVerbose("Got a request for /");
    file = "/index.html";
  }

//
// This part serves the app directory, taking care of file-type and caching
// properties for html, javascript, css and image files. 
//
// It also handles non-existent files and if-modified-since headers.
//
  fs.readFile("./app" + file,function(error,data) {
    if ( error ) {
//    Send a 404 for non-existent files
      console.log("Error reading ./app"+file+": "+error);
      response.writeHead(404,{"Content-type":"text/plain"});
      response.end("Sorry, page not found<br>");
    } else {
//
//    The file exists, so deal with if-modified-since header, if given by the client
//
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
//
// The file was modified - or the client didn't send an if-modified-since header.
// So, send the file!
//
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
}); // http.createServer

//
// Read the config file, then watch it for changes
//
var readConfig = function() {
  var contents = fs.readFileSync(configFile);
  console.log("Config file ",configFile," read");

  config = JSON.parse(contents);
  config.verbose = parseInt(config.verbose);
  if ( config.verbose ) {
    logVerbose = logVerboseReal;
  } else {
    logVerbose = function() {};
  }

  console.log("Config: Host and port: ", config.host, ":", config.port);
  console.log("Config: Verbosity: ", config.verbose);
  console.log("Config: Logfile: ", config.logfile)
};
readConfig();

fs.watchFile(configFile, function(current, previous) {
  console.log("Config changed");
  readConfig();
});

//
// Fire up the server!
//
server.listen(config.port,config.host,function() {
  console.log("Listening on " + config.host + ":" + config.port);
});