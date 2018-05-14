
//
// Global Hunts List for development
//

// previously used (in index.html) <script src="/src/js/load-data.js"></script><!-- demo data till persistent storage is up -->
// it can probably go back there once chooseAndShowHunt() is sorted
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
          alert("looking for hunt #" + huntId);
          let chosenHunt = null;




          //trying to get into the global list and find out what's in there
          let firstHunt = globalHuntsList[0];
          alert("first element in globalHuntsList is of type " + typeof(firstHunt)); //should be object

          let propsList = "Props:\n";
          alert("initial propsList: " + propsList);
          for (var propertyName in firstHunt) {
            if (object.hasOwnProperty(propertyName)) {
              propsList = propsList + propertyName + " ";
            }
          }
          alert(propsList); //This alert isn't firing at all




          for(let huntToCheck in globalHuntsList){
//            alert("comparing " + huntId + " to " + huntToCheck.huntId);
            if(huntToCheck.huntId == huntId){ 
//              alert("found " + huntId + " in list");
              chosenHunt = hunt; 
            }
          }
          // if(!chosenHunt){ //error }
//          alert("hunt #" + chosenHunt.huntId + " " + chosenHunt.huntName);
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
