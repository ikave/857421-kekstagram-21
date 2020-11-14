'use strict';

(function () {
  const pictureTemplate = document.querySelector(`#picture`)
  .content
  .querySelector(`.picture`);

  const picturesList = document.querySelector(`.pictures`);

  const renderPost = function (post) {
    const postElement = pictureTemplate.cloneNode(true);

    postElement.querySelector(`.picture__img`).setAttribute(`src`, post.url);
    postElement.querySelector(`.picture__img`).setAttribute(`alt`, post.description);
    postElement.querySelector(`.picture__likes`).textContent = post.likes;
    postElement.querySelector(`.picture__comments`).textContent = post.comments.length;
    postElement.setAttribute(`data-id`, post.id);
    return postElement;
  };

  window.gallery = function (posts) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < posts.length; i++) {
      fragment.appendChild(renderPost(posts[i]));
    }
    picturesList.appendChild(fragment);
  };

})();
