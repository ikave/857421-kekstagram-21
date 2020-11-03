'use strict';

(function () {
  const body = document.querySelector(`body`);
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

  const onError = function (message) {
    const errorArea = document.createElement(`div`);
    errorArea.textContent = message;
    errorArea.style.position = `absolute`;
    errorArea.style.top = 0;
    errorArea.style.left = 0;
    errorArea.style.padding = `50px`;
    errorArea.style.backgroundColor = `red`;
    body.append(errorArea);
  };

  const onSuccess = function (data) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < data.length; i++) {
      fragment.appendChild(renderPost(data[i]));
    }
    picturesList.appendChild(fragment);
  };

  window.load(onSuccess, onError);
})();
