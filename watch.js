var fs = require("fs");
console.log("started");
var config = JSON.parse(fs.readFileSync("./config.json"));
console.log("Initial config: ", config);

fs.watchFile("./config.json", function(current, previous) {
  console.log("Config changed");
  config = JSON.parse(fs.readFileSync("./config.json"));
  console.log("New config: ", config);
});