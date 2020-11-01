'use strict';

(function () {
  const bigPicture = document.querySelector(`.big-picture`);
  const socialComments = bigPicture.querySelector(`.social__comments`);
  const socialCommentsCount = bigPicture.querySelector(`.social__comment-count`);
  const commentsLoader = bigPicture.querySelector(`.comments-loader`);
  const bigPictureCloseButton = bigPicture.querySelector(`.big-picture__cancel`);
  const picturesList = document.querySelector(`.pictures`);

  socialCommentsCount.classList.add(`hidden`);
  commentsLoader.classList.add(`hidden`);

  const oldComments = socialComments.children;
  for (let i = oldComments.length - 1; i >= 0; i--) {
    oldComments[i].remove();
  }

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
    for (let i = 0; i < post.comments.length; i++) {
      createSocialComment(post.comments, i, socialComments);
    }
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
  };

  const showBigPicturePopup = function () {
    bigPicture.classList.remove(`hidden`);
    document.querySelector(`body`).classList.add(`modal-open`);
  };

  const closeBigPicturePopup = function () {
    bigPicture.classList.add(`hidden`);
    document.querySelector(`body`).classList.remove(`modal-open`);
  };

  const closeBigPictureEsc = function (evt) {
    window.util.pressEscKey(evt, closeBigPicturePopup);
  };

  const getBigPictureProp = function (evt) {
    const pictures = picturesList.querySelectorAll(`.picture`);
    let target = evt.target;
    if (evt.target.classList.contains(`picture`)) {
      target = evt.target;
    } else {
      target = evt.target.parentElement;
    }
    for (let picture of pictures) {
      if (target.dataset.id === picture.dataset.id) {
        for (let i = 0; i < window.data.posts.length; i++) {
          if (parseInt(target.dataset.id, 10) === window.data.posts[i].dataIndex) {
            let post = window.data.posts[i];
            renderBigPicture(bigPicture, post);
          }
        }
      }
    }
  };

  const deleteSocialComments = function () {
    let comments = socialComments.querySelectorAll(`.social__comment`);
    for (let i = 0; i < comments.length; i++) {
      comments[i].remove();
    }
  };

  picturesList.addEventListener(`click`, function (evt) {
    if (evt.target.classList.contains(`picture__img`)) {
      showBigPicturePopup();
      getBigPictureProp(evt);
    }
  });

  picturesList.addEventListener(`keydown`, function (evt) {
    if (evt.key === `Enter`) {
      showBigPicturePopup();
      getBigPictureProp(evt);
    }

    window.addEventListener(`keydown`, closeBigPictureEsc);
  });

  bigPictureCloseButton.addEventListener(`click`, function () {
    closeBigPicturePopup();
    deleteSocialComments();

    window.removeEventListener(`keydown`, closeBigPictureEsc);
  });

})();
