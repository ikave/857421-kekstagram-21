'use strict';

(function () {
  const bigPicture = document.querySelector(`.big-picture`);
  const socialComments = bigPicture.querySelector(`.social__comments`);
  const commentsLoader = bigPicture.querySelector(`.comments-loader`);
  const bigPictureCloseButton = bigPicture.querySelector(`.big-picture__cancel`);
  const picturesList = document.querySelector(`.pictures`);

  let startIndex = 0;
  let endIndex = 5;

  const removeComments = function () {
    const oldComments = socialComments.children;
    for (let i = oldComments.length - 1; i >= 0; i--) {
      oldComments[i].remove();
    }
  };

  const createSocialComment = function (array, index, parent) {
    const element = document.createElement(`li`);
    element.classList.add(`social__comment`);

    const image = document.createElement(`img`);
    image.classList.add(`social__picture`);
    image.setAttribute(`src`, array[index].avatar);
    image.setAttribute(`alt`, array[index].name);
    image.setAttribute(`width`, `35`);
    image.setAttribute(`height`, `35`);

    const text = document.createElement(`p`);
    text.classList.add(`social__text`);
    text.textContent = array[index].message;

    element.append(image);
    element.append(text);
    parent.append(element);
  };

  const renderSocialComments = function (post) {
    const COMMENTS_LOAD_STEP = 5;

    const comments = post.comments;
    if (comments.length < endIndex) {
      endIndex = comments.length;
      commentsLoader.classList.add(`hidden`);
    }

    for (let i = startIndex; i < endIndex; i++) {
      createSocialComment(comments, i, socialComments);
    }
    startIndex = startIndex + COMMENTS_LOAD_STEP;
    endIndex = endIndex + COMMENTS_LOAD_STEP;
  };

  const renderBigPicture = function (item, post) {

    const image = item.querySelector(`.big-picture__img`).children;
    const likes = item.querySelector(`.likes-count`);
    const commentsCount = item.querySelector(`.comments-count`);
    const description = item.querySelector(`.social__caption`);

    image[0].setAttribute(`src`, post.url);
    description.textContent = post.description;
    likes.textContent = post.likes;
    commentsCount.textContent = post.comments.length;

    renderSocialComments(post);

    commentsLoader.addEventListener(`click`, function () {
      renderSocialComments(post);
    });
  };

  const showBigPicturePopup = function (item) {
    bigPicture.classList.remove(`hidden`);
    document.querySelector(`body`).classList.add(`modal-open`);
    document.querySelector(`body`).classList.remove(`modal-open`);
    removeComments();
    renderBigPicture(bigPicture, item);
    window.addEventListener(`keydown`, closeBigPictureEsc);
  };

  const closeBigPicturePopup = function () {
    startIndex = 0;
    endIndex = 5;
    bigPicture.classList.add(`hidden`);
    commentsLoader.classList.remove(`hidden`);
  };

  const closeBigPictureEsc = function (evt) {
    window.util.pressEscKey(evt, closeBigPicturePopup);
  };

  const deleteSocialComments = function () {
    let comments = socialComments.querySelectorAll(`.social__comment`);
    for (let i = 0; i < comments.length; i++) {
      comments[i].remove();
    }
  };

  window.getData = function (posts) {
    picturesList.addEventListener(`click`, function (evt) {
      let target = evt.target.closest(`.picture`);
      if (target) {
        for (let post of posts) {
          if (post.id.toString() === target.dataset.id) {
            window.preview.show(post);
          }
        }
      }
    });
  };

  bigPictureCloseButton.addEventListener(`click`, function () {
    closeBigPicturePopup();
    deleteSocialComments();

    window.removeEventListener(`keydown`, closeBigPictureEsc);
    bigPictureCloseButton.removeEventListener(`click`, closeBigPicturePopup);
  });

  window.preview = {
    show: showBigPicturePopup
  };

})();
