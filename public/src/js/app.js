
//
// Globals for development
//
  // This will be obsolete once hunts are stored persistently in a database
  let globalHuntsList = [];
  let globalAnimalsList = ["Doe", "Buck", "Sasquatch", "Moose", "Squirrel", "Mushroom", "UFO", "Bear", "Other Thing"];
  let demoWatchlist = ["Doe", "Sasquatch", "Moose"]; //demo list for development use
  let useDemoDataForHuntsList = true;
  if (useDemoDataForHuntsList){ loadDemoHuntsData(); }
  let useDemoDataForNewHunts = true;
  


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
        else if(viewName == "new-hunt"){ 
          if(useDemoDataForNewHunts){ fillNewHuntWithDemoData("Dangerous Hunt", "Humans", "Stand", "Helicopter"); }
        }
        else if(viewName == "hunt-overview") { populateHuntOverview(hunt); }
        else if(viewName == "watchlist") { 
          displaySelector(hunt);
          //showCurrentWatchlist(hunt); 
        }
        //if changing to field-notes, will need fieldNotesID (if none, we're starting a new fieldNotes)
      }
    }
  }

  function chooseAndShowView(event) {
    // Assumes CLICKED element has data-view attribute, passes this to changeView
    // (If LISTENING element has data-hunt attribute, passes this also)
    if(event.target.classList.contains("navBtn")){
      let view = event.target.getAttribute("data-view");
      let huntId = event.currentTarget.getAttribute("data-hunt");
      changeView(view, getHunt(huntId));
    }
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
    if(event.target.classList.contains("navBtn")){
      changeView("hunt-overview", getHunt(findAttributeUp(event.target, "data-hunt")));
    }
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
      newP.classList.add("navBtn");
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
// Hunt Events (aka Activities)
//

  function HuntEvent(huntEventType){
    // Constructor for superclass from which all Hunt Event subclasses inherit
    this.huntEventType = huntEventType; //note, photo, observation, or harvest
    this.huntEventId = Date.now(); //Take datetime (id) from user, or make one
  };
  //HuntEvent.prototype.exampleSuperMethod = function() { alert("Superclass method activate!"); };

  function HuntNoteEvent(noteText) {  
    // Constructor for the Note-type subclass
    HuntEvent.call(this, "note"); // call superclass constructor
    this.noteText = noteText;
  };
  // Use the superclass' prototype (but for object construction, use the subclass)
  HuntNoteEvent.prototype = Object.create(HuntEvent.prototype);
  HuntNoteEvent.prototype.constructor = HuntNoteEvent;
  // To add methods to subclass (including overriding superclass' methods):
    //HuntNoteEvent.prototype.exampleSuperMethod = function() { alert("Superclass method overridden in subclass"); };
    //HuntNoteEvent.prototype.exampleSubclassMethod = function() { alert("Subclass method activate!"); };

  // HuntNoteEvent Test 
    var hne = new HuntNoteEvent("A note");
    console.log("New " + hne.huntEventType + "-type hunt event (ID#" + hne.huntEventId +"): '" + hne.noteText + "'"); 
    // logs "New note hunt event (ID#[someDateTime]: 'A note')"


  //The remaining subclasses are untested as of 6/23/18

  function HuntObservationEvent(noteText, hunt) {  
    // Constructor for the Observation-type subclass
    // Takes a noteText string and a Hunt object
    HuntEvent.call(this, "observation"); // call superclass constructor
    //this.animalsCounter = newAnimalsCounter(hunt.watchlist);
    this.noteText = noteText || "";
  };
  HuntObservationEvent.prototype = Object.create(HuntEvent.prototype);
  HuntObservationEvent.prototype.constructor = HuntObservationEvent;

  function HuntPhotoEvent(noteText, imageFile) {
    // Constructor for the Photo-type subclass
    // Takes a noteText string and an imageFile file
    HuntEvent.call(this, "photo"); // call superclass constructor
    //this.imageFile = imageFile;
    this.noteText = noteText || "";    
  };
  HuntPhotoEvent.prototype = Object.create(HuntEvent.prototype);
  HuntPhotoEvent.prototype.constructor = HuntPhotoEvent;

  function HuntHarvestEvent(harvestDetailsObject) {
    // Constructor for the Harvest-type subclass
    // (Tentatively) takes a harvestDetailsObject object
    HuntEvent.call(this, "harvest"); // call superclass constructor
    //set properties here according to the provided harvestDetailsObject
  };
  HuntHarvestEvent.prototype = Object.create(HuntEvent.prototype);
  HuntHarvestEvent.prototype.constructor = HuntHarvestEvent;



//
// functions brought in from Watchlist Demo
//

  const addAnimalToList = function(animalName, list){
    let finalName = animalName.toLowerCase();
    if(!list.includes(finalName)){ list.push(finalName); } 
  }

  const newAnimalsSelector = function(watchlist){ //
    //Takes an optional watchlist (array) parameter
    // Makes an array of animal objects, one for each animal in the global list
    // Gives each animal a 'name' property and a 'selected' property (initialized to false)
    // If a watchlist is passed in, sets the 'selected' property for all listed animals to true
    //  (It would be cool to do this with a constructor that extends array instead)
    let animalsSelector = [];
    for(let animalName of globalAnimalsList){
      let animal = { name: animalName, isSelected: false }; 
      animalsSelector.push(animal);
    }
    watchlist = watchlist || [];
    for(let animal of animalsSelector){
      let animalName = animal.name;
      for (let watched of watchlist){
        if(animalName == watched){
            animal.isSelected = true;
        }
      }
    }
    return animalsSelector;
  }

  const displaySelector = function(hunt){
    //let cssQuery = "#" + view + " .animalsSelector checkboxList";
    //let selectorChoicesDiv = document.querySelectorAll(".animalsSelector");//("#" + view + " .animalsSelector");
    //selectorChoicesDiv.innerHTML = "woot";
    let watchlistDiv = document.querySelector("#watchlist .animalsSelector"); // For now
        //the querySelector property has no relation to our custom newAnimalsSelector object
    watchlistDiv.innerHTML = "";
    //alert("displaySelector:\n " + hunt.watchlist);
    let watchlist = hunt.watchlist;
    selector = newAnimalsSelector(watchlist);
    for (let animal of selector){
      let animalDiv = document.createElement("div");
      let animalText = document.createTextNode(animal.name); 
      animalDiv.appendChild(animalText);  
      animalDiv.classList.add("animalDiv");
      if(animal.isSelected == true){
        //alert(animal.name + " isSelected in display");






        // Now we need to:
        // - Show the proper list during hunt creation
        // - Get this to work with watchlists made during hunt creation!
        // - Toggle .selected on click (listener callbacks may need to care about .animalDiv as well as .navBtn)
        animalDiv.classList.add("selected");





      }
      watchlistDiv.appendChild(animalDiv);
    }
  }

  const updateSelectionDisplay = function(event){
    // (Don't bother updating the FieldNotes object until user clicks save)
    if(event.target.classList.contains("animalDiv")){
      event.target.classList.toggle("selected");
    }
  }

  //rename to "makeCounterFromList()"
  const newAnimalsCounter = function(watchlist){
    // "Constructor" for a Counter (Array)
    // Takes an array of strings, returns an array of objects, each with 
    //   two properties: Name and Count. Names come from the passed-in array,
    //   and the Count for each is initialized to zero 
    let animalsCounter = [];
    for(let animalName of watchlist){
      let animal = { name: animalName, count: 0 };
      animalsCounter.push(animal);
    }
    return animalsCounter;
  }

  //tweak
  const displayCounts = function(counter){
    // Takes a newAnimalCounter 'object' (Array), makes a div for each animal, and adds spans for content 
    // (See the related event listener and css styles)
    let counterDiv = document.querySelector("#someView .animalsCounter");
    
    // (might need to clear innerHTML from counterDiv before adding content each time)
    
    for (let animal of counter){
      appendNewElement("div", counterDiv, { classes: [animal.name] }); //animalDiv
    }
    // Extra loop assures the containing counterDiv is already in the DOM when we try to append to it
    for (let animal of counter){
      let animalDiv = document.querySelector("#someView .animalsCounter ."+animal.name);
      appendNewElement("span", animalDiv, { text: animal.name, classes: ["animalName"] });    
      appendNewElement("span", animalDiv, { text: animal.count.toString(), classes: ["animalCount"] });
      appendNewElement("span", animalDiv, { text: " + ", classes: ["btn", "increment"] });
      appendNewElement("span", animalDiv, { text: " - ", classes: ["btn", "decrement"] });
    }
  }
  
  //tweak
  const updateCountDisplay = function(event){
    // Respond to increment/decrement buttons for animals in field notes
    // (Don't bother updating the FieldNotes object until user clicks save)
    let targ = event.target;
    if(event.target.classList.contains("btn")){
      let btn = event.target;
      let animalName = event.target.parentElement.className;
      let countSpan = document.querySelector("#someView .animalsCounter ."+animalName+ " .animalCount");
      let count = parseInt(countSpan.innerText);
      if(btn.classList.contains("decrement") && count > 0){ count--; }
      else if(btn.classList.contains("increment")){ count++; }
      countSpan.innerText = count.toString();
    }
  }

  //rename to "getWatchlistFromSelector()"
  const newWatchlist = function(selector){
    let newWatchlist = [];
    for(let animal of selector){
      if(animal.isSelected){
        newWatchlist.push(animal.name);
      }
    }
    return newWatchlist;
  }



//
// Misc helper functions  
//

  function woo(appendString){ s = appendString || ""; alert("woo " + s); }

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
    //if(minutes < 10){ minutes = "0" + minutes} // Untested; without this, 12:06AM shows as "12:6 AM"
    let formatted = month + "/" + day + "/" + year + "  " + hours + ":" + minutes + period;
    return formatted;
  }

  function findAttributeUp (el, attr) {
    // Takes an html element (object) and an attribuite name (string)
    // Looks for the attribute in the given element and then each of its acestors
    // Returns the attribute's value from the first element where it is found
    while (!el.hasAttribute(attr) && (el = el.parentElement)){ /*do nothing*/ }
    return el.getAttribute(attr); //TODO: add "|| null" or something here in case we reach the top
  }

  function appendNewElement(type, parent, options) {
    // Takes an html element type, a parent node, and an (optional) array of options
    // Creates (and returns) an element of the given type and appends it to the parent node
    // Sets id, text, classes, and attribs according to options
    // Classes must be an array; attribs must be an array of objects with 'key' and 'val' properties 
    let el = document.createElement(type);
    //if(options){ //   <<-- We might need this check before proceeding
      if (options.id){ el.id = options.id; }
      if (options.text){ el.innerText = options.text; }
      if (options.classes){ 
        for (let myClass of options.classes){
          el.classList.add(myClass);
        }
      }
      if (options.attribs){
        for (let attribute of options.attribs){
          el.setAttribute(attribute.key, attribute.val);
        }
      }
    //}
    parent.appendChild(el);
    return el;
  }

  function appendElementWithIdToParent (type, id, parent) { 
    // deprecated - replace calls with calls to appendNewElement()
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

  function fillNewHuntWithDemoData(huntName, quarry, huntType, stand){
    // Fills inputs on newHunt form with demo data for development use
    document.getElementById("newHuntName").value = huntName;
    document.getElementById("newHuntQuarry").value = quarry;
    document.getElementById("newHuntType").value = huntType;
    document.getElementById("newHuntStand").value = stand;
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
