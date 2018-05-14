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

  function Hunt(name, quarry, type, stand, watchlist){
    // Constructor for Hunt objects
    this.huntName = name;
    this.huntId = Date.now();
    this.quarry = quarry;
    this.huntType = type;
    this.stand = stand;
    this.watchlist = watchlist || []; //cuz otherwise passing an empty array breaks the code
    this.huntEvents = [];
  }

  function makeNewHunt(){
    //collect inputs including selected animals
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
    //make hunt object and add it to the global hunt list
    let myNewHunt = new Hunt(huntName, quarry, huntType, stand, animals);
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
      //newP.classList.add("hunt-summary");
      //newP.addAttribute("data-hunt", huntId);
      newP.appendChild(summaryTxt);
      listDiv.appendChild(newP);
    }
  }


  function chooseAndShowHunt(event){
    var huntSummaries = document.querySelectorAll(".huntSummary");
    for (var huntSummary of huntSummaries){
      // this is a hack because "event.currentTarget == huntSummary" is not working
      // it's fine if we know the target is not nested more than one level below huntsListDiv
      // but it's technically wrong and should be modified to respond to all decendants 
      if (event.target == huntSummary || event.target.parentNode == huntSummary){          
        //the data-hunt attributes are currently hard-coded and need to be dynamic
        var huntId = huntSummary.getAttribute("data-hunt");
        if (huntId){
          let chosenHunt = null;
          for(let hunt in globalHuntsList){
            if(hunt.id == huntId){ 
              chosenHunt = hunt; 
            }
          }
          // if(!chosenHunt){ //error }
          changeView("hunt-overview", chosenHunt);
        }
      }
    }
  }

  function populateHuntOverview(hunt){ 
    document.getElementById("currentHuntName").innerText = hunt.huntName;
    document.getElementById("currentHuntDate").innerText = hunt.huntId; //format this
    document.getElementById("currentHuntQuarry").innerText = hunt.quarry;
    document.getElementById("currentHuntType").innerText = hunt.huntType;
    document.getElementById("currentHuntStand").innerText = hunt.stand;
  //  Need ULs or something for these arrays
  //    document.getElementById("currentHuntWatchlist").innerText = chosenHunt.watchlist; //array
  //    document.getElementById("currentHuntEvents").innerText = chosenHunt.events; //object

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
