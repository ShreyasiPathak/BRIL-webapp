//
// Fetch and display data for a 'Zoomable Time-series' chart
//
var zoomable_time_series = { // this is a global object, so pick a name that represents your view uniquely
  me: 'zoomable_time_series', // put the name of the object here too. Makes the rest of the code more generic

  activeButton:null, // holds 'loading' state of 'Single refresh' button
  animate: true,

  get: function() {
    var url = baseUrl + "/get/" + this.me + "/data";
    console.log("GETting "+this.me.toUpperCase()+" data from " + url);
    $.ajax({
      dataType: "json",
      url: url,
      success: this.successGet,
      error:   this.errorGet,
      context: this
    });
  },
  errorGet: function(response,textStatus,jqXHR) { // callback for handling ajax errors data
    console.log("errorGet: Ajax call failed: status = "+jqXHR.status);
    console.log("errorGet response:",JSON.stringify(response));
    console.log("errorGet jqXHR:",JSON.stringify(jqXHR));
    console.log("errorGet textStatus:",textStatus);
    ajaxFail("#"+this.me+"-chart-message",jqXHR,textStatus);
  },
  successGet: function(response,textStatus,jqXHR) { // callback for displaying data
//  Reset 'loading' state of single-refresh button, if it was active
    if ( this.activeButton ) { this.activeButton.button('reset'); }

//
//  Parse the data into a useable form
//
    var data = response.data;
console.log(data);
//
//  Add a 'download JSON' option to the menu button. Have to clone the Highcharts menu and
//  append to that, otherwise you get a mess
//
    var menuItemsOrig = Highcharts.getOptions().exporting.buttons.contextButton.menuItems;
    var menuItems = $.extend([], true, menuItemsOrig);
    menuItems.push( { text: "Download JSON", onclick: function() { saveJSON('BASIC_AREA data.json',data); } } );

//
//  This is the meat of the plotting functionality.
//
//  Choose a chart-type that you like from http://www.highcharts.com/demo, copy
//  the code here, and manipulate it until it shows your data the way you like.
//
  var char = new Highcharts.Chart({
    chart: { renderTo: this.me+'-chart', zoomType: 'x' },
    title: { text: 'Zoomable Time-series' },
    // subtitle: { text: getFormattedDate() },
    subtitle: {
        text: document.ontouchstart === undefined ?
                'Click and drag in the plot area to zoom in' :
                'Pinch the chart to zoom in'
    },
    exporting: {
      buttons: {
        contextButton: {
          enabled: true,
          text: 'Export data',
          menuItems: menuItems
        },
      },
    },
    xAxis: {
        type: 'datetime',
        minRange: 10 * 1000 // milliseconds
    },
    yAxis: {
        title: {
            text: 'Something or other...'
        }
    },
    legend: {
        enabled: false
    },
    plotOptions: {
        area: {
            fillColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                stops: [
                    [0, Highcharts.getOptions().colors[0]],
                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
            },
            marker: {
                radius: 2
            },
            lineWidth: 1,
            states: {
                hover: {
                    lineWidth: 1
                }
            },
            threshold: null
        }
    },

    series: [{
        animation: this.animate,
        type: 'area',
        name: 'Fake data',
        pointInterval: 1000, // milliseconds
        pointStart: Date.UTC(2015, 0, 1),
        data: data.ZTS
    }]
  });

//
// Back to routine stuff. You shouldn't need to change much here...
//
// Disable animations after the first load. They get boring quickly...
    this.animate = false;
  }, // successGet

  start: function() {
    $('#'+this.me+'_single_refresh').button().prop('disabled', false);
    $('#'+this.me+'_auto_refresh').button().html("Start auto-refresh");
    this.autoRefreshOn = false;
    this.get();
  },

  init: function() {
    var obj = this; //  use the 'obj' object in click-handlers to make sure the context is correct.
    var el;

    views.push(this); // register this global view object

//  handler for the single-refresh button, if present...
    if ( el = $('#'+obj.me+'_single_refresh') ) { // only build handler if the element exists!
      $(el).click(function() {
        obj.activeButton = $(this).button('loading');
        obj.get();
      });
    }

//  handler for the auto-refresh button, if present...
    if ( el = $('#'+obj.me+'_auto_refresh') ) { // only build handler if the element exists!
      this.autoRefreshOn = false;
      this.autoRefresh = function() {
    // use the 'obj' object here instead of 'this', because of the setTimeout context issue
        if ( obj.autoRefreshOn ) {
          obj.get();
          timers.push(setTimeout(obj.autoRefresh,2500)); // 'obj' instead of 'this' here too...
          $('#'+obj.me+'_single_refresh').button().prop('disabled', true); // don't need this every time, but heck...
        } else {
          return;
        }
      };

      $(el).click(function() {
        if ( obj.autoRefreshOn ) {
          console.log("Stopping auto-refresh");
          $('#'+obj.me+'_single_refresh').button().prop('disabled', false);
          $('#'+obj.me+'_auto_refresh').button().html("Start auto-refresh");
          obj.autoRefreshOn = false;
          return;
        } else {
          console.log("Starting auto-refresh");
          $('#'+obj.me+'_auto_refresh').button().html("Stop auto-refresh");
          obj.autoRefreshOn = true;
        }
        obj.autoRefresh();
      });
    }
    return this; // Return 'this' so I can call init() directly, avoiding typing the name one more time!
  }
}.init();