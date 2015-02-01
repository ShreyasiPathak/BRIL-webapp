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
    chart: { renderTo: 'other2-chart', type: 'column' },
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
              setFadeMessage("#other2-chart-message",
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
  animate = false;
  $('#debug').text(JSON.stringify(mask));
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
