
//
// Global Hunts List for development
//
  // This will be obsolete once hunts are stored persistently in a database
  let globalHuntsList = [];
  loadDemoHuntsData();



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

function changeView(viewName, hunt){

  alert("in changeView");

  // (silly to calc this each time, but okay for now)
  let viewContainers = document.querySelectorAll(".viewContainer");
  // Take viewName(string) and optional hunt(object), display only the view chosen 
  for (viewContainer of viewContainers){
    viewContainer.style.display = "none";
  }
  alert("finished hiding views");
  //broke this into two loops b/c the "show" loop exits after succeeding for some scary reason
  counter = 0;
  for (viewContainer of viewContainers){
    if(viewContainer.id === viewName){
      viewContainer.style.display = "block";
      //alert("viewName = " + viewName);
      if(viewName == "hunts-list"){ 
        updateHuntsListView(); 
        alert("viewName = " + viewName + " (should be hunts-list)");
      }
      else if(viewName == "hunt-overview") { 
        alert("Populating Hunt Overview (viewName = " + viewName + ") with " + hunt.huntId);
        populateHuntOverview(hunt); 
      }
      else alert("viewName is neither hunts-list nor hunt-overview, but " + viewName);
    }
    else { counter++; }
  }
  alert("finished showing view (" + counter + " hidden)" );
  //it seems this is working well
}

function chooseAndShowView(event) {
  // Assumes CLICKED element has data-view attribute, passes this to changeView
  // (If LISTENING element has data-hunt attribute, passes this also)
  let view = event.target.getAttribute("data-view");
  let huntId = event.currentTarget.getAttribute("data-hunt");
  alert("entering changeView from chooseAndShowView");
  changeView(view, getHunt(huntId));
  //event.stopPropagation(); //don't pass event any further up to other listeners
}



//
// Hunts
//

  function Hunt(name, id, quarry, type, stand, watchlist){
    // Constructor for Hunt objects
    this.huntName = name;
    this.huntId = id;
    this.quarry = quarry;
    this.huntType = type;
    this.stand = stand;
    this.watchlist = watchlist || []; //cuz otherwise passing an empty array breaks the code
    this.huntEvents = [];
  
    this.print = function(){ 
      return ("ID = " + this.huntId + "\nName: " + this.huntName + "\nQuarry: " + this.quarry + "\nType: " + this.huntType + "\nStand: " + this.stand); 
    }
  }

  function makeNewHunt(){
    //collect inputs including selected animals
    let huntName = document.getElementById("newHuntName").value || "";
    let huntId = Date.now();
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
    //make hunt object and add it to the global hunt list
    let myNewHunt = new Hunt(huntName, huntId, quarry, huntType, stand, animals);
    globalHuntsList.push(myNewHunt);
    //get properties of newly added hunt and display them in Hunt Overview
    let huntOnList = globalHuntsList[globalHuntsList.length - 1];
    changeView("hunt-overview", huntOnList);
  }

  function getHunt(huntId){
    if(huntId){
      for(let hunt of globalHuntsList){ 
        if(hunt.huntId == huntId){ return hunt; }
      }
    }
    return null;
  }

  function chooseHuntFromList(event){
    // Finds HuntID in or above clicked element and chages to Hunt Overview with that Hunt 
    changeView("hunt-overview", getHunt(findAttributeUp(event.target, "data-hunt")));
  }

  function populateHuntOverview(hunt){
    // Fills in Hunt Overview fields using data from the given Hunt object
    let huntEl = document.getElementById("currentHuntDiv");
    let nameEl = document.getElementById("currentHuntName");
    let dateEl = document.getElementById("currentHuntDate");
    let quarryEl = document.getElementById("currentHuntQuarry");
    let typeEl = document.getElementById("currentHuntType");
    let standEl = document.getElementById("currentHuntStand");
    let eventsEl = document.getElementById("eventsListDiv");
    if(hunt.huntId){
      huntEl.setAttribute("data-hunt", hunt.huntId);
      nameEl.innerText = hunt.huntName;
      dateEl.innerText = formatDateTime(new Date(hunt.huntId));
      quarryEl.innerText = hunt.quarry;
      typeEl.innerText = hunt.huntType;
      standEl.innerText = hunt.stand;
      //eventsEl.innerHTML = hunt.events; //This line is keeping Map's back button from being hidden 
      //for (let event of hunt.events){
        //show list of events (FieldNotes, Photo, and Harvest) in eventsListDiv
      //}
    }
    else{
    // This should never happen -- it's for debugging 
      huntEl.setAttribute("data-hunt", "Error retrieving hunt ID");
      nameEl.innerText = "(No Hunt Info Available)";
      dateEl.innerText = "";
      quarryEl.innerText = "";
      typeEl.innerText = "";
      standEl.innerText = "";
      eventsEl.innerHTML = "";
    }
  }

  function updateHuntsListView(){
    // Populates Hunts List view from globalHuntsList data 
    const sep = ' - ';
    let listDiv = document.getElementById("huntsListDiv");
    listDiv.innerHTML = ""; //empty the list before adding all hunts
    for(let hunt of globalHuntsList){
      let huntName = hunt.huntName;
      let huntId = hunt.huntId;
      let quarry = hunt.quarry;
      let huntType = hunt.huntType;
      let stand = hunt.stand || "";
      //hunt properties go in textNode, which goes in a paragraph, which goes into listDiv
      let newP = document.createElement("p");
      newP.classList.add("huntSummary");
      newP.setAttribute("data-hunt", huntId);
      let summaryTxt = document.createTextNode(huntName +sep+ quarry +sep+ huntType + (stand ? sep + stand : ""));
      newP.appendChild(summaryTxt);
      listDiv.appendChild(newP);
    }
  }



//
// Misc helper functions  
//

  function toggleBlockDisplayById(elementId){
    // Expands/collapses the element (eg watchlist in new-hunt)
    let el = document.getElementById(elementId);
    let display = el.style.display || "none";
    el.style.display = (display == "none") ? "block" : "none";
  }

  function formatDateTime(date){
    // Takes a date object and returns a formatted string
    // For use in displaying Hunt info (and Event info)
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let hours = date.getHours();
    let period = hours < 12 ? "AM" : "PM";
    let minutes = date.getMinutes();
    let formatted = month + "/" + day + "/" + year + "  " + hours + ":" + minutes + period;
    return formatted;
  }

  function findAttributeUp (el, attr) {
    // Takes an html element and an attribuite name
    // Returns the attribute value found in the element or its closest ancestor 
    while (!el.hasAttribute(attr) && (el = el.parentElement)){ /*do nothing*/ }
    return el.getAttribute(attr);
  }

  function loadDemoHuntsData(){
    // Development Demo Hunts
    let id1 = Date.now();
    let sampleHunt1 = new Hunt("Demo Hunt 1", id1, "Bears", "Stand", "Big Bear Stand", ["Bear", "Other Thing"]);
    globalHuntsList.push(sampleHunt1); 
    
    let id2 = id1 + 1; //because in demo code, another Date.now() will generate the same id number as id1
    let sampleHunt2 = new Hunt("Demo Hunt 2", id2, "Mushrooms", "Crawling Around", "", ["Mushroom", "UFO"]);
    globalHuntsList.push(sampleHunt2);
  }
