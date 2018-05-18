
//portal and associated views
$('#portal').load('/src/views/portal.html');
$('#hunts-list').load('/src/views/hunts-list.html');
$('#new-hunt').load('/src/views/new-hunt.html');
$('#predictions').load('/src/views/predictions.html');

//hunt-overview and associated views
$('#hunt-overview').load('/src/views/hunt-overview.html');
$('#new-field-notes').load('/src/views/new-field-notes.html');
$('#new-harvest').load('/src/views/new-harvest.html');
$('#new-photo').load('/src/views/new-photo.html');
$('#map').load('/src/views/map.html');
$('#weather').load('/src/views/weather.html');
$('#watchlist').load('/src/views/watchlist.html');

// note: if offline, browser should typically get the above from cache




//show portal (or load signup & login, and show signup) 
if (true){ //TODO: expression should indicate whether server can authenticate client 
  changeView('portal');
}
else{
  $('#signup').load('/src/views/signup.html');
  $('#login').load('/src/views/login.html');
  changeView('signup');
}
