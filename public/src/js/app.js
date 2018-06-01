
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
  // Takes a viewName string and an optional hunt object
  // Hides all views and displays only the chosen one
  // Depending on the view, calls an additional function (where the hunt argement may be used)

  // (silly to calculate this each time, but not terrible)
  let viewContainers = document.querySelectorAll(".viewContainer");
  for (viewContainer of viewContainers){
    viewContainer.style.display = "none";
  }
  // broke this into two loops b/c the "show" loop exited after succeeding for some scary reason
  for (viewContainer of viewContainers){
    if(viewContainer.id === viewName){
      viewContainer.style.display = "block";
      if(viewName == "hunts-list"){ updateHuntsListView(); }
      else if(viewName == "hunt-overview") { populateHuntOverview(hunt); }
      else if(viewName == "watchlist") { showCurrentWatchlist(hunt); }

    }
  }
}

function chooseAndShowView(event) {
  // Assumes CLICKED element has data-view attribute, passes this to changeView
  // (If LISTENING element has data-hunt attribute, passes this also)
  let view = event.target.getAttribute("data-view");
  let huntId = event.currentTarget.getAttribute("data-hunt");
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
  
    this.toString = function(){ 
      return ("ID = " + this.huntId + "\nName: " + this.huntName + "\nQuarry: " + this.quarry + "\nType: " + this.huntType + "\nStand: " + this.stand); 
    }
  }

  function makeNewHunt(){
    // Collects input from user, creates a Hunt object, adds it to the globalHuntsList,
    //   and changes to Hunt Overview to display the hunt info

    // Collect inputs (including selected animals)
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
    let myNewHunt = new Hunt(huntName, huntId, quarry, huntType, stand, animals);
    globalHuntsList.push(myNewHunt);
    let huntOnList = globalHuntsList[globalHuntsList.length - 1];
    // Make a hunt object and add it to the global hunt list
    // Get properties of newly added hunt and display them in Hunt Overview
    changeView("hunt-overview", huntOnList);
  }

  function getHunt(huntId){
    // Takes a Hunt ID and returns the corresponding Hunt from the globalHuntsList
    // (If no Hunt with that ID exists, returns null)
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
      //eventsEl.innerHTML = hunt.events; //This line was keeping Map's back button from being re-hidden 
      //for (let event of hunt.events){
        //show list of events (FieldNotes, Photo, and Harvest) in eventsListDiv
      //}
    }
    else{
    // This should never happen -- it's just for debugging 
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

  function showCurrentWatchlist(hunt){
    let watchlist = hunt.watchlist;
    let str = "";
    for (let animal of watchlist){ str += animal + "<br />"; }
    document.getElementById("watchlistViewTitle").innerHTML = str;
  }



//
// Misc helper functions  
//

  function woo(){ alert("woo"); }

  function toggleBlockDisplayById(elementId){
    // Expands/collapses the element (eg watchlist in new-hunt)
    let el = document.getElementById(elementId);
    let display = el.style.display || "none";
    el.style.display = (display == "none") ? "block" : "none";
  }

  function formatDateTime(date){
    // Takes a date object and returns a formatted strings
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
    // Looks for the attribute in the given element and each of its acestors
    // Returns the attribute's value from the first element where it is found
    while (!el.hasAttribute(attr) && (el = el.parentElement)){ /*do nothing*/ }
    return el.getAttribute(attr);
  }

  function appendElementWithIdToParent (type, id, parent) { 
    // untested
    var el = document.createElement(type);
    el.id = id;
    parent.appendChild(el);
    return el;
  }

  function loadDemoHuntsData(){
    // Creates Demo Hunts and pushes them to globalHuntsList for development use
    let id1 = Date.now();
    let sampleHunt1 = new Hunt("Demo Hunt 1", id1, "Bears", "Stand", "Big Bear Stand", ["Bear", "Other Thing"]);
    globalHuntsList.push(sampleHunt1); 
    
    let id2 = id1 + 1; //because calling Date.now() again so soon generates the same id number as id1
    let sampleHunt2 = new Hunt("Demo Hunt 2", id2, "Mushrooms", "Crawling Around", "", ["Mushroom", "UFO"]);
    globalHuntsList.push(sampleHunt2);
  }

/*
<p>Not gonna use this, just a "details" element demo - no javascript required!</p>
<details> //details has an open attribute that determines the state (like 'expanded')
  <summary>Header for spoiler</summary>
  <div>
    <p> Awesome secret hidden stuff</p>
    <details> //details has an open attribute that determines the state (like 'expanded')
    <summary>Header for inner spoiler</summary>
    <p>Double secret probation stuff!</p>
  </details>
  </d>
</details>
*/
