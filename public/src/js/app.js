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
// Navigation
//

function changeView(viewName, data){ //data argument would be for hunt or event views
//this should generally happen client-side, though
  var viewContainers = document.querySelectorAll(".viewContainer");
  for (viewContainer of viewContainers){
    if(viewContainer.id == viewName){
      viewContainer.style.display = "block";
//      if(viewName == "hunt-overview"){
//        //alert("changing to hunt overview"); //the alert appears before the new view
//        //populateHuntOverview(data); //if the hunt view were displayed, maybe we could populate it?
//      }
    }
    else{
      viewContainer.style.display = "none";
    } 
  }
}

function chooseAndShowView(event) {
  var navBtns = document.querySelectorAll(".navBtn");
  for (var btn of navBtns){
    if (event.target == btn){          
      var chosenView = btn.getAttribute("data-view");
      changeView(chosenView);
    }
  }
  event.stopPropagation(); //don't bother bubbling the event up any further
}



//
// Hunts
//

  function Hunt(name, quarry, type, stand, watchlist){
    // Constructor for Hunt objects
    this.huntName = name;
    this.huntId = Date.now();
    //alert(this.huntId);
    this.quarry = quarry;
    this.huntType = type;
    this.stand = stand;
    this.watchlist = watchlist || []; //cuz otherwise passing an empty array breaks the code
    this.huntEvents = [];
  }

  //Global Hunts List (until we start using database)
  let globalHuntsList = [];
  let sampleHunt1 = new Hunt("Demo Hunt 1", "Bears", "Stand", "Big Bear Stand", ["Bear", "Other Thing"]);
  let sampleHunt2 = new Hunt("Demo Hunt 2", "Mushrooms", "Crawling Around", "", ["Mushroom", "UFO"]);
  globalHuntsList.push(sampleHunt1);
  globalHuntsList.push(sampleHunt2);
  //for(let hunt of globalHuntsList){
  //  alert("On list: " + hunt.huntName);
  //}

  function makeNewHunt(){
    let huntName = document.getElementById("newHuntName").value || "";
    let quarry = document.getElementById("newHuntQuarry").value || "";
    let huntType = document.getElementById("newHuntType").value || "";
    let stand = document.getElementById("newHuntStand").value || "";
    let animals = [];
    let animalOptions = document.getElementsByName("newHuntAnimals");
    for (let i = 0; i < animalOptions.length; i++){
      let box = animalOptions[i];
      if(box.checked === true){
        animals.push(box.value);
      }
    }
    let hunt = new Hunt(huntName, quarry, huntType, stand, animals);
    globalHuntsList.push(hunt);
    let huntOnList = globalHuntsList[globalHuntsList.length - 1];
    changeView("hunt-overview");
    document.getElementById("currentHuntName").innerText = huntOnList.huntName;
    document.getElementById("currentHuntDate").innerText = huntOnList.huntId; //format this
    document.getElementById("currentHuntQuarry").innerText = huntOnList.quarry;
    document.getElementById("currentHuntType").innerText = huntOnList.huntType;
    document.getElementById("currentHuntStand").innerText = huntOnList.stand;
  }

  function populateHuntOverview(hunt){ //was going to be called from changeView()...
    alert("populating hunt: " + hunt.huntName);
    //document.getElementById("currentHuntName").innerText() = huntOnList.huntName;
    //alert(document.getElementById("currentHuntName").innerHTML());
  }



//
// Misc helper functions  
//

  function toggleBlockDisplayById(elementId){ //used to expand/collapse watchlist in new-hunt...
    let el = document.getElementById(elementId);
    let display = el.style.display || "none";
    el.style.display = (display == "none") ? "block" : "none";
  }

  function appendElement(parentId, tag, id, text){ //not used as of 5/11/18
    //create element in parent (works for elements that are not self-closing and can contain text)
    var parent = document.getElementById(parentId);
    var el = document.createElement(tag);
    el.setAttribute("id", id);
    var textNode = document.createTextNode(text);
    el.appendChild(textNode);
    parent.appendChild(el);
  }
