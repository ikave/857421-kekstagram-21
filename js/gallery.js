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
    postElement.setAttribute(`data-id`, post.dataIndex);
    return postElement;
  };

  const fragment = document.createDocumentFragment();
  for (let i = 0; i < window.data.posts.length; i++) {
    fragment.appendChild(renderPost(window.data.posts[i]));
  }
  picturesList.appendChild(fragment);
})();
