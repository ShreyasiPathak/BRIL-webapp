//
// Deal with BCM1F masking
//
$('#bcm1f-mask-channels').click(function(event) {
  event.preventDefault();
  $('#bcm1f-mask-channels').button().prop('disabled', true);
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
    console.log(jqXHR);

    setFadeMessage("#bcm1f-mask-message",
                   "Problem setting mask, response = '"+jqXHR.responseText+"'",
                   "bg-danger",
                   "#bcm1f-mask-channels");
    console.log("successMask: Ajax call failed: status = "+jqXHR.status);
    return;
  }
  console.log("Put BCM1F mask successfully")
  setFadeMessage("#bcm1f-mask-message",
                 "Mask successfully uploaded",
                 "bg-success",
                 "#bcm1f-mask-channels");
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
  console.log("Got BCM1F mask successfully");
  $("#bcm1f_tagname").text(response.tagName);
  for ( var i=1; i<=4; i++ ) {
    var detector = "BCM1F_" + i;
    for ( channel=1; channel<=12; channel++ ) {
      var value = response[detector][channel-1];
      $('#' + detector + '-' + channel).prop("checked",( value ? true : false));
    }
  }
};
