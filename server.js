var http = require("http");
var fs = require("fs");
console.log("Starting:");
var config, configFile="./config.json";

readConfig = function() {
  var contents = fs.readFileSync(configFile);
  console.log("Config file ",configFile," read");

  config = JSON.parse(contents);
  config.verbose = parseInt(config.verbose);

  console.log("Config: Host and port: ", config.host, ":", config.port);
  console.log("Config: Verbosity: ", config.verbose);
  console.log("Config: Logfile: ", config.logfile)
}

var gaussian1 = function(x1,x2) {
  z = Math.sqrt(-2 * Math.log(x1)) * Math.cos( 2 * Math.PI * x2 );
  return(Math.round(z*10+100));
}
var gaussian2 = function(x1,x2) {
  z = Math.sqrt(-2 * Math.log(x1)) * Math.sin( 2 * Math.PI * x2 );
  return(Math.round(z*10+100));
}
var randomData = function() {
  var i, data = { D1:[], D2:[], D3:[], D4:[] };
  for ( i=0; i<6; i++ ) {
    u1 = Math.random(); u2 = Math.random();
    data.D1.push(gaussian1(u1,u2));
    data.D1.push(gaussian2(u1,u2));
  }
  for ( i=0; i<6; i++ ) {
    u1 = Math.random(); u2 = Math.random();
    data.D2.push(gaussian1(u1,u2));
    data.D2.push(gaussian2(u1,u2));
  }
  for ( i=0; i<6; i++ ) {
    u1 = Math.random(); u2 = Math.random();
    data.D3.push(gaussian1(u1,u2));
    data.D3.push(gaussian2(u1,u2));
  }
  for ( i=0; i<6; i++ ) {
    u1 = Math.random(); u2 = Math.random();
    data.D4.push(gaussian1(u1,u2));
    data.D4.push(gaussian2(u1,u2));
  }
  return(data);
}

var server = http.createServer( function(request,response) {
  console.log("Received request: " + request.url);

  var mask = { D1:[0,0,0,0,0,0,0,0,0,0,0,0],
               D2:[0,0,0,0,0,0,0,0,0,0,0,0],
               D3:[0,0,0,0,0,0,0,0,0,0,0,0],
               D4:[0,0,0,0,0,0,0,0,0,0,0,0] };

  if ( request.url == "/put/mask" ) {
    console.log("Got a request to put a mask");
    response.writeHead(200,{
          "Content-type":  "text/plain",
          "Cache-control": "max-age=0"
        });
    request.on("data", function (chunk) {
        console.log("Got channel mask: "+ chunk);
    });
    response.end("Got data OK");
    console.log("Send PUT response");
    return;
  }

  if ( request.url == "/get/data" ) {
    console.log("Got a request for data");
    response.writeHead(200,{
          "Content-type":  "application/json",
          "Cache-control": "max-age=0"
        });
    var res = {
      data: randomData(),
      mask: mask,
      runNumber: 1234567,
      timestamp: (new Date).getTime()
    };
    console.log(JSON.stringify(res));
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
          console.log("Not modified: ./app"+file);
          response.writeHead(304);
          response.end();
          return;
        }
      }
      console.log("Sending ./app"+file);
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