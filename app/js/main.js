(function(){ // this is the main application
  console.log("Starting...");

  $('#view-bcm1f' ).button().click( function() { setView("bcm1f") ; })
  $('#view-basic_area' ).button().click( function() { setView("basic_area") ; })
  // $('#view-other2').button().click( function() { setView("other2"); })

  $(".bcm1f").toggle();
  $(".basic_area").toggle();
  // $(".other2").toggle();

  setView("bcm1f");
})();