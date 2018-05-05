
List of Views:

  Sign Up
    Log In

  Portal
    New Hunt Form
    Hunt List
    Predictions
    (Customize Animals Masterlist)

  Hunt Overview
    Map
    Weather
    (Animal List)
    Log Hunt ?

    Photo Form
      Photo Detail
    Harvest Form
      Harvest Detail ?
    Field Notes

  (Journal Detail - fr. Marvel, just a few hunt-specific details) ?

-  -  -  -  -  -


Details:


Landing...
  Show portal view at root index.html
  If server cannot authenticate device, redirect to a signUp view


SignUp:
  Standard splashscreen with obvious link to Login view for active users


Login:
  Standard stuff (username and password fields)


Portal:
  (Shows 'See hunts', 'Start hunt', and 'Get Predictions')
  1 'See hunts' goes to huntList view 
  2 'Start hunt' shows a _form_ (w/ hunt name, type, etc.)
      1 Submitting the form:
        - gets time (and location and weather if online)
        - creates a new hunt object and appends it to the huntList
        - goes to hunt view
      2 (Cancel returns to portal)
  3 'Get Predictions' (uses server data to calculate and) goes to a Predictions view (must be online)


HuntList:
  1 User can tap any hunt to see details in the hunt view

Journal Detail:
  (Brian had this in Marvel. It shows very basic info for a hunt including the stuff in hunt list plus some additional weather info. Maybe it would pop up when you tap a hunt from the hunt list? but we need something more comprehensive including field notes, harvest info, etc.) 
  If that weather info needs to appear somewhere and doesn't fit in hunt list, maybe have a separate view for it inside hunt.)


Hunt:
  (Shows 'Field Note', 'Harvest', 'Take Photo', 'Animal List (for use in Field Notes'), and a list of huntEvents -- each huntEvent object is either a fieldNotes, a harvest, or a photo.) 
  1 'Field Note' creates a new fieldNotes-type huntEvent object (with its visible list of animals populated, unless it is the first fieldNotes for this hunt), appends it to the list, and shows the fieldNotes view.
  2 'Harvest' creates a new harvest-type huntEvent object, appends it to the list, and shows a Harvest view
  3 'Take Photo' activates the user's camera (or falls back to file-upload), saves the photo as a photo-type huntEvent object, appends it to the list, and returns to the hunt view
  4 'Animal List (for use in Field Notes)'
    - A dropdown with available animals shows options from a masterlist. Selections are added to the visible list for each fieldNotes instance for this hunt. (In mvp, the masterlist is app-scoped. Soon, the masterlist should be user-scoped -- ie the user should be able to add animals to their masterlist which don't appear on the default masterlist.) And they could be allowed to propose changes to the default masterlist.  
  5 User can tap any huntEvent to see details (or expand the photo.)
  Notes:
  - It might be better to have photo be a field within fieldNotes to avoid having some huntEvents be photos
  - Brian had tabs for 'Log Hunt' (ie 'done'?), 'Map', and 'Weather'
  - I'd also like a 'Delete hunt' button (but we'd want to keep the data for predictions, so this isn't an mvp feature)


FieldNotes:
  (Shows the visible list of animals with counter-buttons, and these larger buttons: 'Other', and 'Save')
  1 Animal list is scoped to this hunt. Each animal's counter-buttons are scoped to this huntEvent(ie this fieldNote)
  2 'Other' button lets user add a new animal. (See below.)
  3 'Save' saves fieldNote and returns to hunt view.
  Notes:
  - Adding a new animal:
    - The list of visible animals is scoped to the hunt, not to the specific huntEvent(ie fieldNotes.) Newly created fieldNotes for this hunt should inherit the list. Existing fieldNotes for this hunt should sync with the list when loading (keeping their own counts unchanged.) 
    - The other button goes to the hunt-scoped view for changing the visible list.
  - I'd also like a 'Delete' button (but we'd want to keep the data for predictions, so this isn't an mvp feature)

