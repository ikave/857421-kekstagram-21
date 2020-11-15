'use strict';

const COMMENTS_LOAD_STEP = 5;

const bigPicture = document.querySelector(`.big-picture`);
const socialComments = bigPicture.querySelector(`.social__comments`);
const commentsShown = bigPicture.querySelector(`.comments-shown`);
const commentsLoader = bigPicture.querySelector(`.comments-loader`);
const bigPictureCloseButton = bigPicture.querySelector(`.big-picture__cancel`);
const picturesList = document.querySelector(`.pictures`);

let postElement;
let startIndex = 0;
let endIndex = 5;

const removeComments = () => {
  const oldComments = socialComments.children;
  const comments = Array.from(oldComments);
  for (let comment of comments) {
    comment.remove();
  }
};

const createSocialComment = (array, index, parent) => {
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

const renderSocialComments = (post) => {
  const comments = post.comments;
  if (comments.length <= endIndex) {
    endIndex = comments.length;
    commentsLoader.classList.add(`hidden`);
  }

  for (let i = startIndex; i < endIndex; i++) {
    createSocialComment(comments, i, socialComments);
  }
  startIndex = startIndex + COMMENTS_LOAD_STEP;
  endIndex = endIndex + COMMENTS_LOAD_STEP;
};

const setShownComments = () => {
  const commentsCount = socialComments.children.length;
  commentsShown.textContent = commentsCount;
};

const onCommentsLoaderClick = () => {
  renderSocialComments(postElement);
  setShownComments();
};

const renderBigPicture = (item, post) => {
  const image = item.querySelector(`.big-picture__img`).children;
  const likes = item.querySelector(`.likes-count`);
  const commentsCount = item.querySelector(`.comments-count`);
  const description = item.querySelector(`.social__caption`);

  image[0].setAttribute(`src`, post.url);
  description.textContent = post.description;
  likes.textContent = post.likes;
  commentsCount.textContent = post.comments.length;

  renderSocialComments(postElement);
  setShownComments();
};

const showBigPicturePopup = (item) => {
  postElement = item;
  bigPicture.classList.remove(`hidden`);
  document.querySelector(`body`).classList.add(`modal-open`);
  removeComments();
  renderBigPicture(bigPicture, item);
  commentsLoader.addEventListener(`click`, onCommentsLoaderClick);
  window.addEventListener(`keydown`, onBigPicturePressEsc);
};

const closeBigPicturePopup = () => {
  startIndex = 0;
  endIndex = 5;
  bigPicture.classList.add(`hidden`);
  document.querySelector(`body`).classList.remove(`modal-open`);
  commentsLoader.classList.remove(`hidden`);
  commentsLoader.removeEventListener(`click`, onCommentsLoaderClick);
};

const onBigPicturePressEsc = (evt) => {
  window.util.pressEscKey(evt, closeBigPicturePopup);
};

const deleteSocialComments = () => {
  let comments = socialComments.querySelectorAll(`.social__comment`);
  for (let comment of comments) {
    comment.remove();
  }
};

const getData = (posts) => {
  picturesList.addEventListener(`click`, (evt) => {
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

bigPictureCloseButton.addEventListener(`click`, () => {
  closeBigPicturePopup();
  deleteSocialComments();

  window.removeEventListener(`keydown`, onBigPicturePressEsc);
  bigPictureCloseButton.removeEventListener(`click`, closeBigPicturePopup);
});

window.preview = {
  data: getData,
  show: showBigPicturePopup
};
