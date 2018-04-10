//newPostFormArea is displayed/hidden by button clicks 
var newPostFormArea = document.querySelector('#create-post');

function makeNewPost() { newPostFormArea.style.display = 'block'; }
var newPostButton = document.querySelector('#share-image-button');
newPostButton.addEventListener('click', makeNewPost);

function cancelNewPost() { newPostFormArea.style.display = 'none'; }
var cancelNewPostButton = document.querySelector('#close-create-post-modal-btn');
cancelNewPostButton.addEventListener('click', cancelNewPost);
