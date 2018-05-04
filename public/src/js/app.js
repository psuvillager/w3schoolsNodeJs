
//if browser doesn't support promises, use the polyfill (in promise.js)
if (!window.Promise) { window.Promise = Promise; }

//if browser supports service workers, register ours (sw.js)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js', {scope: "/"}) //scope object argument is optional (and cannot "scope up")
    .then(function () { console.log('[App]: Service worker registered'); })
    .catch(function(err) { console.log(err); });
}

let loadView = function(view){
  //$('.page-content').load('/src/views/' + view + '.html');
  //$('.page-content').load('/src/views/portal.html');
  //alert('woo');
  


  //using jquery here fails
  document.getElementById('test').innerHTML = "Hi"; 



};

document.getElementById('loadRoutingViewButton').addEventListener('click', function(){
  loadView('routing');
});

