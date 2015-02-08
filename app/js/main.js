(function(){ // this is the main application
  console.log("Starting...");

  $('#view-bcm1f' ).button().click( function() { setView("bcm1f") ; })
  $('#view-basic_area' ).button().click( function() { setView("basic_area") ; })
  $('#view-zoomable_time_series').button().click( function() { setView("zoomable_time_series"); })

  $(".bcm1f").toggle();
  $(".basic_area").toggle();
  $(".zoomable_time_series").toggle();

  setView("bcm1f");
})();