//
// Fetch and display BCM1F data
//
var activeButton; // holds 'loading' state of 'Single refresh' button
$('#get_bcm1f_data').click(function() {
  activeButton = $(this).button('loading');
  getBcm1fData();
});

var getBcm1fData = function() {
  var url = baseUrl + "/get/bcm1f/data";
  console.log("GETting BCM1F data from " + url);
  $.ajax({
    dataType: "json",
    url: url,
    success: successBcm1fData
  });
};

var successBcm1fData = function(response,textStatus,jqXHR) { // callback for displaying data
  if ( jqXHR.status != 200 ) {
    console.log("successBcm1fData: Ajax call failed: status = "+jqXHR.status);
    return;
  }
  console.log(response);
  console.log(textStatus);
  console.log(jqXHR);

  $("#runnumber").text(response.runNumber);
  var epoch = new Date(response.timestamp);
  $("#currenttime").text(epoch);
  var yMax = 200,
      data = response.data,
      mask = response.mask;
  if ( activeButton ) { activeButton.button('reset'); }

  var char = new Highcharts.Chart({
    chart: { renderTo: 'chart', type: 'column' },
    title: { text: 'BCM1F channel comparison' },
    subtitle: { text: getFormattedDate() },
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
            $('#debug').text("Detector: " + this.name +
                                 "[" + event.point.x + "] = " +
                                 data[this.name][event.point.x]);
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
}; // successBcm1fData

var autoRefreshOn;
$('#bcm1f_auto_refresh').click(function() {
  var first = true;
  if ( autoRefreshOn ) {
    console.log("Stopping auto-refresh");
    $('#get_bcm1f_data').button().prop('disabled', false);
    $('#bcm1f_auto_refresh').button().html("Start auto-refresh");
    autoRefreshOn = false;
    return;
  } else {
    console.log("Starting auto-refresh");
    $('#bcm1f_auto_refresh').button().html("Stop auto-refresh");
    autoRefreshOn = true;
  }
  var autoRefresh = function() {
    if ( autoRefreshOn ) {
      console.log("autoRefresh is on");
      getBcm1fData();
      setTimeout(autoRefresh,1000);
      if ( first ) {
        $('#get_bcm1f_data').button().prop('disabled', true);
        first = false;
      }
    } else {
      console.log("autoRefresh is off");
      return;
    }
  };
  autoRefresh();
}); // bcm1f_auto_refresh.click()
