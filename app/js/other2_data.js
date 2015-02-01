//
// Fetch and display OTHER1 data
//
var activeButton; // holds 'loading' state of 'Single refresh' button
$('#get_other2_data').click(function() {
  activeButton = $(this).button('loading');
  getOther2Data();
});

var getOther2Data = function() {
  var url = baseUrl + "/get/other2/data";
  console.log("GETting BCM1F data from " + url);
  $.ajax({
    dataType: "json",
    url: url,
    success: successOther2Data
  });
};

var successOther2Data = function(response,textStatus,jqXHR) { // callback for displaying data
  if ( jqXHR.status != 200 ) {
    console.log("successOther2Data: Ajax call failed: status = "+jqXHR.status);
    return;
  }
  console.log(response);
  console.log(textStatus);
  console.log(jqXHR);

  $("#runnumber").text(response.runNumber);
  $("#currenttime").text( "Date: " + getFormattedDate( new Date(response.timestamp) ) );
  var yMax = 200,
      data = response.data,
      mask = response.mask;
  if ( activeButton ) { activeButton.button('reset'); }

  var menuItemsOrig = Highcharts.getOptions().exporting.buttons.contextButton.menuItems;
  var menuItems = $.extend([], true, menuItemsOrig);
  menuItems.push( { text: "Download JSON", onclick: function() { saveJSON('OTHER2 data.json',data); } } );
  var char = new Highcharts.Chart({
    chart: { renderTo: 'other2-chart', zoomType: 'x' },
    title: { text: 'OTHER2 histogram' },
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
        type: 'area',
        name: 'Fake data',
        pointInterval: 1000, // milliseconds
        pointStart: Date.UTC(2015, 0, 1),
        data: data.OTHER2
    }]
  });
  animate = false;
}; // successOther2Data

var autoRefreshOn;
$('#other2_auto_refresh').click(function() {
  var first = true;
  if ( autoRefreshOn ) {
    console.log("Stopping auto-refresh");
    $('#get_other2_data').button().prop('disabled', false);
    $('#other2_auto_refresh').button().html("Start auto-refresh");
    autoRefreshOn = false;
    return;
  } else {
    console.log("Starting auto-refresh");
    $('#other2_auto_refresh').button().html("Stop auto-refresh");
    autoRefreshOn = true;
  }
  var autoRefresh = function() {
    if ( autoRefreshOn ) {
      console.log("autoRefresh is on");
      getOther2Data();
      setTimeout(autoRefresh,1000);
      if ( first ) {
        $('#get_other2_data').button().prop('disabled', true);
        first = false;
      }
    } else {
      console.log("autoRefresh is off");
      return;
    }
  };
  autoRefresh();
}); // other2_auto_refresh.click()
