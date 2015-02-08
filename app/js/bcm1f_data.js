//
// Fetch and display BCM1F data
//
var bcm1f = { // this is a global object, so pick a name that represents your view uniquely
  me: 'bcm1f', // put the name of the object here too. Makes the rest of the code more generic

  activeButton:null, // holds 'loading' state of 'Single refresh' button
  getData: function() {
    var url = baseUrl + "/get/" + this.me + "/data";
    console.log("GETting "+this.me.toUpperCase()+" data from " + url);
    $.ajax({
      dataType: "json",
      url: url,
      success: this.successData,
      context: this
    });
  },

  successData: function(response,textStatus,jqXHR) { // callback for displaying data
    if ( jqXHR.status != 200 ) {
      console.log("successData: Ajax call failed: status = "+jqXHR.status);
      setFadeMessage("#"+this.me+"-chart-message",
                     "Ajax call failed: status="+jqXHR.status+" ("+textStatus+")",
                     "bg-danger",
                     null,
                     10000);
      return;
    }
    console.log("Response: ",response);
    console.log("textStatus: ",textStatus);
    console.log("jqXHR object: ",jqXHR);

//
//  Update a few elements on the page with data-fields that do not get plotted, such as
//  timestamp and run-number
//
    $("#"+this.me+"_runnumber").text(response.runNumber);
    $("#"+this.me+"_currenttime").text( "Date: " + getFormattedDate( new Date(response.timestamp) ) );

    if ( activeButton ) { activeButton.button('reset'); } // reset 'loading' state of single-refresh button

//
//  Parse the data into a useable form
//
    var yMax = 200, // could examine the data and set the y-scale accordingly
        data = response.data;

//
//  Add a 'download JSON' option to the menu button. Have to clone the Highcharts menu and
//  append to that, otherwise you get a mess
//
    var menuItemsOrig = Highcharts.getOptions().exporting.buttons.contextButton.menuItems;
    var menuItems = $.extend([], true, menuItemsOrig);
    menuItems.push( { text: "Download JSON", onclick: function() { saveJSON('BCM1F data.json',data); } } );

//
//  This is the meat of the plotting functionality.
//
//  Choose a chart-type that you like from http://www.highcharts.com/demo, copy
//  the code here, and manipulate it until it shows your data the way you like.
//
    var char = new Highcharts.Chart({
      // Naming convention: renderTo -> (name-of-this-object) + '-chart'
      chart: { renderTo: this.me+'-chart', type: 'column' },
      title: { text: 'BCM1F channel comparison' },
      subtitle: { text: getFormattedDate() },
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
        categories: [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11' ]
      },
      yAxis: {
        min: 0,
        max: yMax,
        title: { text: 'Counts' }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        },
        series: {
          animation: animate,
          cursor: 'pointer',
          events: {
            click: function(event) {
                setFadeMessage("#bcm1f-chart-message",
                               "Detector: " + this.name +
                                  ", channel " + event.point.x + " = " +
                                  data[this.name][event.point.x],
                               "bg-success");
            }
          }
        }
      },
      series: [
        { name: 'BCM1F_1', data: data.BCM1F_1 },
        { name: 'BCM1F_2', data: data.BCM1F_2 },
        { name: 'BCM1F_3', data: data.BCM1F_3 },
        { name: 'BCM1F_4', data: data.BCM1F_4 }
      ]
    });

    animate = false; // disable animations after the first load. They get boring quickly...
  }, // successData

  init: function() {
    var obj = this; //  use the 'obj' object in click-handlers to make sure the context is correct.
    var el;

    views.push(this); // register this global view object

//  handler for the single-refresh button, if present...
    if ( el = $('#'+obj.me+'_single_refresh') ) { // only build handler if the element exists!
      $(el).click(function() {
        activeButton = $(this).button('loading');
        obj.getData();
      });
    }

//  handler for the auto-refresh button, if present...
    if ( el = $('#'+obj.me+'_auto_refresh') ) { // only build handler if the element exists!
      this.autoRefreshOn = false;
      this.autoRefresh = function() {
    // use the 'obj' object here instead of 'this', because of the setTimeout context issue
        if ( obj.autoRefreshOn ) {
          obj.getData();
          timers.push(setTimeout(obj.autoRefresh,1000)); // 'obj' instead of 'this' here too...
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