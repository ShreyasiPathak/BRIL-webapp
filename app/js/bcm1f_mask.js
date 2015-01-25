//
// Deal with BCM1F masking
//
$('#bcm1f-mask-channels').click(function(event) {
  event.preventDefault();
  var i, nSelected, selected=[], checkboxes = $('#mask-management input:checkbox:checked');
  nSelected = checkboxes.length;
  if ( !nSelected ) { return; }
  for ( i=0; i<nSelected; i++ ) {
    selected.push(checkboxes[i].id);
  };
  console.log(JSON.stringify(selected));
  putBcm1fMask(selected);
});

var putBcm1fMask = function(mask) {
// send the new mask bits to the server
  var url = baseUrl + "/put/bcm1f/mask";
  console.log("PUTting mask to " + url);
  $.ajax({
    dataType: "json",
    url: url,
    type: "put",
    data: JSON.stringify(mask),
    success: successBcm1fMask
  });
};

var getBcm1fMask = function() {
  var url = baseUrl + "/get/bcm1f/mask";
  console.log("GETting BCM1F mask from " + url);
  $.ajax({
    dataType: "json",
    url: url,
    success: successBcm1fMask
  });
};

var successBcm1fMask = function(response,textStatus,jqXHR) { // callback for displaying data
  alert(textResponse); // this never gets called!
  if ( jqXHR.status != 200 ) {
    console.log("successMask: Ajax call failed: status = "+jqXHR.status);
    return;
  }
  console.log(response);
  console.log(textStatus);
  console.log(jqXHR);
  $("#bcm1f_tagname").text(response.tagname);
};
