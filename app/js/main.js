var baseUrl, animate=true;
baseUrl = document.location.protocol + "//" + document.location.hostname;
if ( document.location.port ) { baseUrl += ":" + document.location.port; }

function getFormattedDate() { // helper function, formats the date for human readability
  var date = new Date();
  var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
            date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  return str;
}
