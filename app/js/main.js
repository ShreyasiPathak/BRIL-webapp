(function(){ // this is the main application
  console.log("Starting...");

  $('#view-bcm1f' ).button().click( function() { setView("bcm1f") ; })
  $('#view-other1').button().click( function() { setView("other1"); })
  $('#view-other2').button().click( function() { setView("other2"); })

  $(".bcm1f").toggle();
  $(".other1").toggle();
  $(".other2").toggle();

  setView("bcm1f");
})();