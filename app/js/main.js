$(document).ready(function(){ // this is the main application
  console.log("Starting...");

  for (var i=0; i<views.length; i++) {
    var view = views[i], handler;
    console.log("View: ",view.me);
    addView(view.me);

    handler = function(v) {
      return function(event) {
        event.preventDefault();
        setView(v);
      };
    };
    $('#view-'+view.me ).button().click( handler(view.me) );
    $('.'+view.me).toggle();
  }

  var view = document.location.search;
  if ( view ) {
    view = view.split('?view=')[1];
    console.log("Set initial view to ",view);
  } else {
    view = "bcm1f";
  }

  setView(view);
});