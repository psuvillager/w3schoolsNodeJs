
//
// Client-side stuff 
//

//if browser doesn't support promises, use the polyfill (in promise.js)
if (!window.Promise) { window.Promise = Promise; }

//if browser supports service workers, register ours (sw.js)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js', {scope: "/"}) //scope object argument is optional (and cannot "scope up")
    .then(function () { console.log('[App]: Service worker registered'); })
    .catch(function(err) { console.log(err); });
}



//
// Routing stuff
//

let loadView = function(view){
  $('.page-content').load('/src/views/' + view + '.html');
  //$('.page-content').load('/src/views/portal.html');
  //alert('woo');
  

  //jquery is working now!
  $('#test').html("Hi"); 

function changeView(viewName){
//this should generally happen client-side, though
  alert('woo from app.js changeView()');
  $('.viewContainer').not(document.getElementById(viewName)).css("display","none");
  document.getElementById(viewName).css("display","block");
};

document.getElementById('loadRoutingViewButton').addEventListener('click', function(){
  loadView('routing');
});



//
// Helper functions  
//

function test(){ alert "woo from app.js test()"; }

//create element in parent (works for elements that are not self-closing and can contain text)
function appendElement(parentId, tag, id, text){
  var parent = document.getElementById(parentId);
  var el = document.createElement(tag);
  el.setAttribute("id", id);
  var textNode = document.createTextNode(text);
  el.appendChild(textNode);
  parent.appendChild(el);
}