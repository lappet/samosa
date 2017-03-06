var latitude = null;
var longitude = null;


function callApi(searchTerm)
{
  if (searchTerm == '' || searchTerm == undefined) {
    searchTerm = 'Samosas';
  }
  $('#heading').text(searchTerm + ' near you');
  $('#responses').html('');
  $.getJSON("https://emy91u4lqc.execute-api.us-west-1.amazonaws.com/prod/samosas",{latitude: latitude, longitude: longitude, query: searchTerm}, function( data ) {    
    var html = "";
    for (var i=0;i<data.businesses.length;i++)
    {
      var restaurant = data.businesses[i];
      var linkToBiz = "http://www.yelp.com/biz/" + restaurant.id;
      html = html + '<p class="lead"><a href="' + linkToBiz + '" target="">' + restaurant.name + '</a> at a distance of ' + restaurant.distance + ' miles</p>';
    }
    $('#responses').html(html);    
  });
}

function showPosition(location) {    
    latitude = location.coords.latitude;
    longitude = location.coords.longitude;
    callApi();
}

//Error codes documented @ https://developer.mozilla.org/en-US/docs/Web/API/PositionError
var PositionError = {
	PERMISSION_DENIED : 1,
	POSITION_UNAVAILABLE : 2,
	TIMEOUT : 3
};

function errorHandler(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
  var errorMessage = "";
  
  switch(err.code)
  {
  	case PositionError.PERMISSION_DENIED: 
  		errorMessage = '<p class="lead">Please enable location sharing on your device/browser</p>';
  		break;
	case PositionError.POSITION_UNAVAILABLE: 
  		errorMessage = '<p class="lead">Location not available on your device</p>';
  		break;
  	case PositionError.TIMEOUT: 
  		errorMessage = '<p class="lead">Location fetch timed out</p>';
  		break;
  	default:
		errorMessage = '<p class="lead">Something went wrong. Please check location settings on your device</p>';
  }  
  
  $('#responses').html(errorMessage);
};

if (navigator.geolocation) {
    console.log(navigator.geolocation.getCurrentPosition(showPosition,errorHandler));
}
else
{
	var errorMessage = '<p class="lead">Location not available on your device</p>';
	$('#responses').html(errorMessage);
}

$('.btn').click(function(e){  
  var buttons = $('.btn');
  $('.btn').removeClass('btn-primary');  
  $(this).addClass('btn-primary');  
  callApi($(this).text());
});