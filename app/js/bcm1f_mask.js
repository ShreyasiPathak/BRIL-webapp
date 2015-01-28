//
// Deal with BCM1F masking
//
$('#bcm1f-mask-channels').click(function(event) {
  event.preventDefault();
  var i, id, detector, channel, masked, nSelected,
    checkboxes = $('#mask-management input:checkbox:checked'),
    mask = {
      BCM1F_1:[0,0,0,0,0,0,0,0,0,0,0,0],
      BCM1F_2:[0,0,0,0,0,0,0,0,0,0,0,0],
      BCM1F_3:[0,0,0,0,0,0,0,0,0,0,0,0],
      BCM1F_4:[0,0,0,0,0,0,0,0,0,0,0,0]
    };

  nSelected = checkboxes.length;
  for ( i=0; i<nSelected; i++ ) {
    id = checkboxes[i].id.split('-');
    mask[id[0]][id[1]-1] = 1;
  };
  console.log(JSON.stringify(mask));
  putBcm1fMask(mask);
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
    success: successPutBcm1fMask,
    dataType: "text"
  });
};

var successPutBcm1fMask = function(response,textStatus,jqXHR) { // callback for displaying data
  if ( jqXHR.status != 200 ) {
    console.log("successMask: Ajax call failed: status = "+jqXHR.status);
    return;
  }
  console.log("Put BCM1F mask successfully")
  // console.log(response);
  // console.log(textStatus);
  // console.log(jqXHR);
  $("#bcm1f-mask-message").text("Mask successfully uploaded");
  $("#bcm1f-mask-message").addClass("bg-success");
};

var getBcm1fMask = function() {
  var url = baseUrl + "/get/bcm1f/mask";
  console.log("GETting BCM1F mask from " + url);
  $.ajax({
    dataType: "json",
    url: url,
    success: successGetBcm1fMask
  });
};

var successGetBcm1fMask = function(response,textStatus,jqXHR) { // callback for displaying data
  if ( jqXHR.status != 200 ) {
    console.log("successMask: Ajax call failed: status = "+jqXHR.status);
    return;
  }
  console.log("Got BCM1F mask successfully")
  // console.log(response);
  // console.log(textStatus);
  // console.log(jqXHR);
  $("#bcm1f_tagname").text(response.tagName);
};
