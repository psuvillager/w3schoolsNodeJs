
//  //
//  //
//  //  Holding area for Hunt code:
//  //
//  //
    //  (Probably superceded)
    //

//
// HuntEvent construction
//

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