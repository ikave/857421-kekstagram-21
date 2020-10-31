'use strict';

(function () {
  const bigPicture = document.querySelector(`.big-picture`);
  const bigPictureCloseButton = bigPicture.querySelector(`.big-picture__cancel`);
  const picturesList = document.querySelector(`.pictures`);
  const socialComments = bigPicture.querySelector(`.social__comments`);

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
            window.preview.preview(bigPicture, post);
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
