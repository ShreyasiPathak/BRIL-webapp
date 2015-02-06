//
// BRIL monitor server application.
// No user-serviceable parts here, i.e. this is entirely framework and
// nothing relates to the views or data served by the app
//
function now(date) {
  if ( !date ) { date = new Date(); }
  var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
            date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ": ";
  return str;
};
console.log(now(),"Starting");
global.now = now; // make 'now' accessible in loaded modules

var http = require("http"),
    fs   = require("fs"), // used for watching the config file for changes
    config, configFile="./config.json",
    logVerbose,
    logVerboseReal=function() { console.log(arguments); };
global.logVerbose = logVerbose = logVerboseReal;

//
// Read the config file, then watch it for changes
//
var readConfig = function() {
  var contents = fs.readFileSync(configFile);
  console.log(now(),"Config file ",configFile," read");

  config = JSON.parse(contents);
  config.verbose = parseInt(config.verbose);
  if ( config.verbose ) {
    logVerbose = logVerboseReal;
  } else {
    logVerbose = function() {};
  }

  console.log(now(),"Config: Host and port: ", config.host, ":", config.port);
  console.log(now(),"Config: Verbosity: ", config.verbose);
  console.log(now(),"Config: Logfile: ", config.logfile);
  console.log(now(),"Module path: ",config.module_path);
};
readConfig();

fs.watchFile(configFile, function(current, previous) {
  console.log(now(),"Config changed");
  readConfig();
});

//
// load URL handler modules
//
var handler_files = fs.readdirSync(config.module_path),
    handlers=[], handler;
for ( var i=0; i < handler_files.length; i++ ) {
  handler = handler_files[i];
  if ( handler.match('^handle_.*.js$') ) {
    handler = handler.replace(/.js$/,'');
    handlers.push( require(config.module_path+"/"+handler) );
  }
}

// create the server, and define the handler for all valid URLs
var server = http.createServer( function(request,response) {
  console.log(now(),"Received request: " + request.url);

  for ( var i=0; i<handlers.length; i++ ) {
    handler = handlers[i];
    for ( var j=0; j<handler.path.length; j++ ) {
      var path = handler.path[j];
      if ( request.url == path ) {
        var method = path.split('/')[1];
        handler[method](request,response);
        return;
      }
    }
  }

//
// tell the server to quit, in case you'd ever want to do that...
//
  if ( request.url == "/quit" ) {
    console.log(now(),"Got a request to quit: Outta here...");
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
  if ( file == "/" ) {
    logVerbose(now(),"Got a request for /");
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
      console.log(now(),"Error reading ./app"+file+": "+error);
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
      response.setHeader("Content-type",  type);
      response.setHeader("Cache-control", "max-age=3600");
      response.setHeader("Last-modified", mtime);
      response.writeHead(200);
      response.end(data);
    }
  })
}); // http.createServer

//
// Fire up the server!
//
server.listen(config.port,config.host,function() {
  console.log(now(),"Listening on " + config.host + ":" + config.port);
});