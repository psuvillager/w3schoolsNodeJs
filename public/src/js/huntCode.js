
//  //
//  //
//  //  Holding area for Hunt code
//  //
//  //





//
// Hunt and HuntEvent construction
//
/*
  function makeNewHunt(){
    let huntName = document.getElementById("newHuntName").value;
    let quarry document.getElementById("newHuntQuarry").value;
    let huntType = document.getElementById("newHuntType").value;
    let stand = document.getElementById("newHuntStand").value;

    let animals = [];
    let animalOptions = document.getElementsByName("newHuntAnimals");
    for (let i = 0; i < animalOptions.length; i++){
      let box = animalOptions[i];
      if(box.checked === true){
        alert(box.value);
        animals.push(box.value);
      }
    }
  }

  function Hunt(name, quarry, type, stand, watchlist){
    // Constructor for Hunt objects
    this.huntName = name;
    this.huntId = Date.now();
    this.quarry = quarry;
    this.huntType = type;
    this.stand = stand || this.stand = "";
    this.watchlist = watchlist;
    this.huntEvents = [];

//    this.addHuntEvent = function(){
//      let newEvent = new HuntEvent(eventType, this);
//      if (newEvent){ 
//        this.huntEvents.push(newEvent); 
//      }
//    }

  }
*/
  function HuntEvent(eventType, hunt){
    this.eventId =  Date.now();
    this.hunt = hunt;
    this.eventType = eventType;
    this.detail = function(){
      switch(eventType) {
        case "fieldNotes": 
          return { text: "Field notes object"; }//new FieldNotes(hunt.watchlist); 
          break; 
        case "harvest": 
          return { text: "Harvest object"; }//new Harvest(); 
          break;
        case "photo": 
          return { text: "Photo object"; }//new Photo(); 
          break;
        default: 
          return null;
      }
    }
  }
/*
  function FieldNotes(watchlist){
    
  }
  function fieldNotes(){
    
  }
  function fieldNotes(){
    
  }
*/