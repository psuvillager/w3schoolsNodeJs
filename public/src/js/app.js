
//
// Global Hunts List for development
//
  // Global list with demo data formerly lived in load-data.js, which was imported into index.html. Maybe return to that setup
  // All of this will be obsolete once hunts are stored persistently in a database

  let globalHuntsList = [];

  //demo data
  let id1 = Date.now();
  let sampleHunt1 = new Hunt("Demo Hunt 1", id1, "Bears", "Stand", "Big Bear Stand", ["Bear", "Other Thing"]);
  globalHuntsList.push(sampleHunt1); 
  
  let id2 = id1 + 1;
  let sampleHunt2 = new Hunt("Demo Hunt 2", id2, "Mushrooms", "Crawling Around", "", ["Mushroom", "UFO"]);
  globalHuntsList.push(sampleHunt2);



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

function changeView(viewName, hunt){ //data argument would be for hunt or event views
//this should generally happen client-side, though
  var viewContainers = document.querySelectorAll(".viewContainer");
  for (viewContainer of viewContainers){
    if(viewContainer.id == viewName){
      viewContainer.style.display = "block";
      if(viewName == "hunts-list"){ updateHuntsList(); }
      else if(viewName == "hunt-overview"){ populateHuntOverview(hunt); }
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


  function updateHuntsList(){
    const sep = ' - ';
    let listDiv = document.getElementById("huntsListDiv");
    listDiv.innerHTML = ""; //empty the list before adding all hunts
    for(let hunt of globalHuntsList){ //
      let huntName = hunt.huntName;
      let huntId = hunt.huntId;
      let quarry = hunt.quarry;
      let huntType = hunt.huntType;
      let stand = hunt.stand || "";
      //hunt properties go in textNode, which goes in a paragraph, which goes into listDiv
      var summaryTxt = document.createTextNode(huntName +sep+ quarry +sep+ huntType + (stand ? sep + stand : ""));
      var newP = document.createElement("p");
      newP.classList.add("huntSummary");
      newP.setAttribute("data-hunt", huntId);
      newP.appendChild(summaryTxt);
      listDiv.appendChild(newP);
      //alert("In updateHuntsList(), huntId = " + newP.getAttribute("data-hunt"));
    }
  }


  function chooseAndShowHunt(event){
    var huntSummaries = document.querySelectorAll(".huntSummary");
    for (var huntSummary of huntSummaries){
      // this is a hack because "event.currentTarget == huntSummary" is not working
      // it's fine if we know the target is not nested more than one level below huntsListDiv
      // but it's technically wrong and should be modified to respond to all decendants 
      if (event.target == huntSummary || event.target.parentNode == huntSummary){  
        var huntId = huntSummary.getAttribute("data-hunt");
        if (huntId){
          let chosenHunt = null;
          for(let hunt of globalHuntsList){
            if(hunt.huntId == huntId){ 
              chosenHunt = hunt; 
            }
          }
          // if(!chosenHunt){ //error... }
          changeView("hunt-overview", chosenHunt);
        }
      }
    }
  }

  function populateHuntOverview(hunt){ 
    document.getElementById("currentHuntDiv").setAttribute("data-hunt", hunt.huntId)
    document.getElementById("currentHuntName").innerText = hunt.huntName;
    document.getElementById("currentHuntDate").innerText = formatDateTime(new Date(hunt.huntId));
    document.getElementById("currentHuntQuarry").innerText = hunt.quarry;
    document.getElementById("currentHuntType").innerText = hunt.huntType;
    document.getElementById("currentHuntStand").innerText = hunt.stand;
    document.getElementById("currentHuntEvents").innerHTML = hunt.events;
    for (let event of hunt.events){
      //show list of events (FieldNotes, Photo, and Harvest)
    }
  }



//
// Misc helper functions  
//

  function toggleBlockDisplayById(elementId){ //used to expand/collapse watchlist in new-hunt...
    let el = document.getElementById(elementId);
    let display = el.style.display || "none";
    el.style.display = (display == "none") ? "block" : "none";
  }

  function formatDateTime(date){
    //takes a date object and returns a string
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let hours = date.getHours();
    let period = hours < 12 ? "AM" : "PM";
    let minutes = date.getMinutes();
    let formatted = month + "/" + day + "/" + year + "  " + hours + ":" + minutes + period;
    return formatted;
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
