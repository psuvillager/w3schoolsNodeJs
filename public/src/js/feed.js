var createPostArea = document.querySelector('#create-post');
function openCreatePostModal() { createPostArea.style.display = 'block'; }
function closeCreatePostModal() { createPostArea.style.display = 'none'; }

var shareImageButton = document.querySelector('#share-image-button');
shareImageButton.addEventListener('click', openCreatePostModal);

var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);
