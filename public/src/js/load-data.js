  //Global Hunts List (until we start using database)
  let globalHuntsList = [];
  
  //demo data
  let id1 = Date.now();
  let sampleHunt1 = new Hunt("Demo Hunt 1", id1, "Bears", "Stand", "Big Bear Stand", ["Bear", "Other Thing"]);
  globalHuntsList.push(sampleHunt1); 
  
  let id2 = id1 + 1;
  let sampleHunt2 = new Hunt("Demo Hunt 2", id2, "Mushrooms", "Crawling Around", "", ["Mushroom", "UFO"]);
  globalHuntsList.push(sampleHunt2);
  