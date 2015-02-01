//
// Fetch and display OTHER1 data
//
var activeButton; // holds 'loading' state of 'Single refresh' button
$('#get_other1_data').click(function() {
  activeButton = $(this).button('loading');
  getOther1Data();
});

var getOther1Data = function() {
  var url = baseUrl + "/get/other1/data";
  console.log("GETting OTHER1 data from " + url);
  $.ajax({
    dataType: "json",
    url: url,
    success: successOther1Data
  });
};

var successOther1Data = function(response,textStatus,jqXHR) { // callback for displaying data
  if ( jqXHR.status != 200 ) {
    console.log("successOther1Data: Ajax call failed: status = "+jqXHR.status);
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
  menuItems.push( { text: "Download JSON", onclick: function() { saveJSON('OTHER1 data.json',data); } } );
  var char = new Highcharts.Chart({
    chart: { renderTo: 'other1-chart', type: 'area' },
    title: { text: 'OTHER1 channel comparison' },
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
      allowDecimals: false,
      labels: {
        formatter: function () {
          return this.value; // clean, unformatted number
        }
      }
    },
    yAxis: {
      title: {
        text: 'y-axis of some sort'
      },
      labels: {
        formatter: function () {
          return this.value / 1000 + 'k';
        }
      }
    },
    tooltip: {
      pointFormat: '{series.name} value <b>{point.y:,.0f}</b>'
    },
    plotOptions: {
      area: {
        pointStart: 0,
        marker: {
          enabled: false,
          symbol: 'circle',
          radius: 2,
          states: {
            hover: {
              enabled: true
            }
          }
        }
      }
    },
    series: [{
      name: 'Channel 1',
      data: data.OTHER1_1,
    }, {
      name: 'Channel 2',
      data: data.OTHER1_2,
    }]
  });
  animate = false;
}; // successOther1Data

var autoRefreshOn;
$('#other1_auto_refresh').click(function() {
  var first = true;
  if ( autoRefreshOn ) {
    console.log("Stopping auto-refresh");
    $('#get_other1_data').button().prop('disabled', false);
    $('#other1_auto_refresh').button().html("Start auto-refresh");
    autoRefreshOn = false;
    return;
  } else {
    console.log("Starting auto-refresh");
    $('#other1_auto_refresh').button().html("Stop auto-refresh");
    autoRefreshOn = true;
  }
  var autoRefresh = function() {
    if ( autoRefreshOn ) {
      console.log("autoRefresh is on");
      getOther1Data();
      setTimeout(autoRefresh,1000);
      if ( first ) {
        $('#get_other1_data').button().prop('disabled', true);
        first = false;
      }
    } else {
      console.log("autoRefresh is off");
      return;
    }
  };
  autoRefresh();
}); // other1_auto_refresh.click()
