// some global variables, tsk tsk...

var views = []; // an array of view-handlers, each view registers here when it's loaded

var timers = [], // global array of timers, so I can cancel them all on page-switch
    baseUrl = document.location.protocol + "//" + document.location.hostname;
if ( document.location.port ) { baseUrl += ":" + document.location.port; }

function getFormattedDate(date) {
// helper function, formats the date for human readability
  if ( !date ) { date = new Date(); }
  var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
            date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  return str;
};

var setFadeMessage = function(el,message,bgclass,button,timeout=2000) {
// helper function: set a message banner with a background colour.
// Leave it visible for a while, then fade it out over a longer time.
// Re-enable an associated button, if required
  $(el).stop()              // stop any previous animation
       .css('opacity',1.0)  // make the status window visible in case it wasn't
       .text(message)
       .removeClass( 'bg-success bg-info bg-warning bg-danger' )       // remove any colour classes
       .addClass(bgclass);  // mark it accordingly
  setTimeout( function() {
    if ( button ) { $(button).prop('disabled', false); }
    $(el).animate(
                    { opacity:0 }, 5000,
                    function() { $(el).removeAttr('disabled'); }
                  )
    }, timeout);
};

var saveJSON = function(filename,data){
// extend the Highcharts export menu with a 'download json' option
  var a = document.createElement('a');
  a.setAttribute('download', filename);
  a.href = 'data:;,' + JSON.stringify(data);
  a.innerHTML = 'ignore...';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

ajaxFail = function(el,jqXHR,textStatus) {
  setFadeMessage(el,"Ajax call failed: status="+jqXHR.status+" ("+textStatus+")",
               "bg-danger",null,10000);
};

var activeView; // record which view is active
var setView = function(view) {
// toggle between views
  console.log("switch to view",view);
  var i, v;

// clear all timers running in the current view
  for (var i = 0; i < timers.length; i++) { clearTimeout(timers[i]); }

  for ( i=0; i<views.length; i++ ) {
    v = views[i];
    $("#view-"+v.me).button().prop('disabled', ( v.me == view ? true : false ) );
    if ( (v.me == view) || (v.me == activeView) ) { $('.'+v.me).toggle(); }
  }

  // now I need the view object, not just it's name...
  for ( i=0; i<views.length; i++ ) {
    if ( (views[i].me == view) ) { view = views[i]; }
  }

  view.start();
  activeView = view.me;
  console.log("Switched to view",view.me);
};

var now = function(date) {
  if ( !date ) { date = new Date(); }
  var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
            date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":";
  return str;
};

var addView = function(me) {
  var Me = me.charAt(0).toUpperCase() + me.slice(1);
  Me = Me.replace(/_/g,' ');
  $('<div class="select-view-div">' +
    '  <button type="submit" class="btn btn-primary" id="view-'+me+'">'+Me+'</button>' +
     '</div>').appendTo('#select-views');

// only append if it doesn't exist already!
  if ( !$('#control-panel .'+me) ) { // this doesn't work :-(
    console.log("Add control-panel element for "+me);
    $('<div class="'+me+'"></div>').appendTo('#control-panel');
  }

  $('<div class="row '+me+'"><!-- holds the buttons for refreshing the '+Me+' data -->' +
    '  <div class="col-md-3"></div>' +
    '  <div class="col-md-6"></div>' +
    '  <div class="col-md-3">' +
    '    <div class="btn-group" role="group">' +
    '      <button class="btn btn-primary" id="'+me+'_single_refresh" role="button" data-loading-text="Loading...">Single refresh</button>' +
    '      <button class="btn btn-primary" id="'+me+'_auto_refresh" role="button" data-toggle="button" aria-pressed="false" style="margin-left: 4px">Start auto-refresh</button>' +
    '    </div>' +
    '  </div>' +
    '</div> <!-- row '+me+' -->' +
    '<div class="row '+me+'"><!-- this is where the main chart goes -->' +
    '  <div class="col-md-3"></div>' +
    '  <div class="col-md-9">' +
    '    <div id="'+me+'-chart" class="chart"></div>' +
    '    <div id="'+me+'-chart-message" class="chart-selected-message"></div>' +
    '  </div>' +
    '</div> <!-- row '+me+' -->').appendTo('#chart-container');
};