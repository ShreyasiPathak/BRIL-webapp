#!/usr/bin/env node
"use strict";

var u = require("./bril-util");
console.log(u);
global.now = u.now; // make 'now' accessible in loaded modules

var argv = require("optimist").argv;
var defaultConfigFile = "config.json";
var config;

if ( argv.h || argv.help ) {
  console.log("\n",
  "Usage:",argv.$0," {options} where options are:\n",
  "         -c,--config <path-to-config-file> (default: '"+defaultConfigFile+"')\n",
  "         -h,--help   ...you're reading it :-)"
  );
  process.exit(0);
}

console.log(now(),"Starting");

//
// BRIL monitor server application.
// No user-serviceable parts here, i.e. this is entirely framework and
// nothing relates to the views or data served by the app
//
var http = require("http"),
    fs   = require("fs"); // used for watching the config file for changes
    var configFile = (argv.config || argv.c || defaultConfigFile),
    logVerbose,
    ConsoleLog = function() {
      var arg='';
      for ( var i in arguments ) { arg += arguments[i] + ' '; }
      console.log(now(),arg);
    };
global.logVerbose = logVerbose = ConsoleLog;

//
// Read the config file, then watch it for changes
//
var readConfig = function() {
  var contents = fs.readFileSync(configFile);
  ConsoleLog("Config file ",configFile," read");

  config = JSON.parse(contents);
  config.verbose = parseInt(config.verbose);
  if ( config.verbose ) {
    logVerbose = ConsoleLog;
  } else {
    logVerbose = function() {};
  }

  ConsoleLog("Config: Host and port: ", config.host, ":", config.port);
  ConsoleLog("Config: Verbosity: ", config.verbose);
  ConsoleLog("Config: Logfile: ", config.logfile);
  ConsoleLog("Module path: ",config.module_path);
  global.config = config;
};
readConfig();

fs.watchFile(configFile, function() {
  ConsoleLog("Config changed");
  readConfig();
});

//
// load URL handler modules from the path named in
// config.module_path
//
var handler_files = fs.readdirSync(config.module_path),
    handlers=[], handler, i, j;
for ( i=0; i < handler_files.length; i++ ) {
  handler = handler_files[i];
  if ( handler.match('^handle_.*.js$') ) { // N.B. only 'handle_*.js' files here!
    handler = handler.replace(/.js$/,'');
    ConsoleLog("Add handler: ",handler);
    handler = require("../"+config.module_path+"/"+handler);
    handlers.push( handler );
    if ( handler.path.length > 1 ) {
      ConsoleLog("      paths: ",JSON.stringify(handler.path));
    }
  }
}

// create the server!
var server = http.createServer( function(request,response) {
  ConsoleLog("Received request: " + request.url);

//
// Find a matching handler, if any, for this URL. Call the handler method
// corresponding to the URL ('get', 'put') and return.
//
// If no matching handler is found, fall-through to the next level, which
// handles basic file-serving. CSS, HTML and all that...
//
  for ( i=0; i<handlers.length; i++ ) {
    handler = handlers[i];
    for ( j=0; j<handler.path.length; j++ ) {
      var path = handler.path[j];
      if ( request.url === path ) {
        var method = path.split('/')[1];
        handler[method](request,response);
        return;
      }
    }
  }

//
// trivial test data, just to ease the development path
//
  if ( request.url === "/get/test/data" ) {
    ConsoleLog("Sending test data");
    response.writeHead(200,{
        "Content-type":  "application/json",
        "Cache-control": "max-age=0"
      });
    response.end(JSON.stringify({data:[7.0,6.9,9.5,14.5,18.2,21.5,25.2,26.5,23.3,18.3,13.9,9.6]}));
    return;
  }

//
// tell the server to quit, in case you'd ever want to do that...
//
  if ( request.url === "/quit" ) {
    ConsoleLog("Got a request to quit: Outta here...");
    response.writeHead(200,{"Content-type":"text/plain"});
    response.end("Server exiting at your request");
    server.close();
    process.exit(0);
  }

//
// Redirect a request for '/' to the main application HTML file.
// This then falls-through to the rest of the application
//
  var file = request.url;
  file = file.split('?')[0];
  if ( file === "/" ) {
    logVerbose(now(),"Got a request for /");
    file = "/index.html";
  }

//
// This part serves the app directory, taking care of file-type and caching
// properties for html, javascript, css and image files.
//
// It also handles non-existent files and if-modified-since headers.
//
  var imstime, mtime = new Date(fs.statSync("./app"+file).mtime);
  fs.readFile("./app" + file,function(error,data) {
    if ( error ) {
//    Send a 404 for non-existent files
      ConsoleLog("Error reading ./app"+file+": "+error);
      response.writeHead(404,{"Content-type":"text/plain"});
      response.end("Sorry, page not found<br>");
      return;
    }
//
//  The file exists, so deal with if-modified-since header, if given by the client
//
    if ( request.headers["if-modified-since"] ) {
      imstime = new Date(request.headers["if-modified-since"]).getTime();
      if ( mtime ) { mtime = mtime.getTime(); }
      else         { mtime = 9999999999; }
      if ( imstime >= mtime ) {
        logVerbose(now(),"Not modified: ./app"+file);
        response.writeHead(304);
        response.end();
        return;
      }
    }
//
// The file was modified - or the client didn't send an if-modified-since header.
// So, send the file!
//
    logVerbose(now(),"Sending ./app"+file);
    var type;
    if      ( file.match(/.html$/) ) { type = "text/html"; }
    else if ( file.match(/.css$/) )  { type = "text/css"; }
    else if ( file.match(/.js$/) )   { type = "application/javascript"; }
    else if ( file.match(/.png$/) )  { type = "application/png"; }
    else if ( file.match(/.ico$/) )  { type = "image/x-icon"; }
    else if ( file.match(/.eot$/) )  { type = "application/vnd.ms-fontobject"; }
    else if ( file.match(/.map$/) )  { type = "application/json"; } // or application/octet-stream
    else if ( file.match(/.svg$/) )  { type = "image/svg+xml"; }
    else if ( file.match(/.ttf$/) )  { type = "font/ttf"; }
    else if ( file.match(/.woff$/) ) { type = "font/x-woff"; }

    if ( !type ) { console.log("No Content-type for ",file); process.exit(0); }
    response.setHeader("Content-type",  type);
    response.setHeader("Cache-control", "max-age=3600");
    if ( !mtime ) { console.log("No mtime for ",file); process.exit(0); }
    response.setHeader("Last-modified", mtime);
    response.writeHead(200);
    response.end(data);
  });
}); // http.createServer

//
// Fire up the server!
//
server.listen(config.port,config.host,function() {
  ConsoleLog("Listening on " + config.host + ":" + config.port);
});
