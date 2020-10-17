'use strict';

const MESSAGES = [
  `Всё отлично!`,
  `В целом всё неплохо. Но не всё.`,
  `Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.`,
  `Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.`,
  `Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.`,
  `Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!`
];

const MESSAGES_AUTORS = [
  `Артем`,
  `Андрей`,
  `Егор`,
  `Вечеслав`,
  `Ирина`,
  `Григорий`
];

const POST_DESCRIPTION = [
  `Мое первое фото`,
  `Мое второе фото`,
  `Мое третье фото`,
  `Мое крайнее фото`,
];

const MESSAGE_COUNT_MIN = 1;
const MESSAGE_COUNT_MAX = 2;
const POST_COMMENTS_MAX = 20;
const USER_AVATAR_IMAGE_MAX = 6;
const POST_LIKES_MIN = 15;
const POST_LIKES_MAX = 200;
const POST_COUNT = 25;
const FIRST_POST = 0;

const pictureTemplate = document.querySelector(`#picture`)
    .content
    .querySelector(`.picture`);

const picturesList = document.querySelector(`.pictures`);

const getRandomNum = function (min, max) {
  return Math.round(min + Math.random() * (max - min));
};

const getRandomPropArray = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

const getMessage = function () {
  let messages = [];

  for (let i = 0; i < getRandomNum(MESSAGE_COUNT_MIN, MESSAGE_COUNT_MAX); i++) {
    let message = getRandomPropArray(MESSAGES);
    messages.push(message);
  }

  if (messages[0] === messages[1]) {
    messages[1] = getRandomPropArray(MESSAGES);
  }

  let result = messages.join(` `);

  return result;
};

const getMessageAuthor = function (authors) {
  return getRandomPropArray(authors);
};

const getPostComments = function () {
  let comments = [];

  for (let i = 0; i < getRandomNum(0, POST_COMMENTS_MAX); i++) {
    let comment = {
      avatar: `img/avatar-${getRandomNum(1, USER_AVATAR_IMAGE_MAX)}.svg`,
      message: getMessage(),
      name: getMessageAuthor(MESSAGES_AUTORS)
    };
    comments.push(comment);
  }
  return comments;
};

const getPost = function (count) {
  let post = {
    url: `photos/${count}.jpg`,
    description: getRandomPropArray(POST_DESCRIPTION),
    likes: getRandomNum(POST_LIKES_MIN, POST_LIKES_MAX),
    comments: getPostComments()
  };
  return post;
};

const getPosts = function () {
  let posts = [];
  for (let i = 1; i <= POST_COUNT; i++) {
    let post = getPost(i);
    posts.push(post);
  }
  return posts;
};

const posts = getPosts();

const renderPost = function (post) {
  const postElement = pictureTemplate.cloneNode(true);

  postElement.querySelector(`.picture__img`).setAttribute(`src`, post.url);
  postElement.querySelector(`.picture__img`).setAttribute(`alt`, post.description);
  postElement.querySelector(`.picture__likes`).textContent = post.likes;
  postElement.querySelector(`.picture__comments`).textContent = post.comments.length;

  return postElement;
};

const fragment = document.createDocumentFragment();
for (let i = 0; i < posts.length; i++) {
  fragment.appendChild(renderPost(posts[i]));
}
picturesList.appendChild(fragment);

// module3-task2

const bigPicture = document.querySelector(`.big-picture`);
// bigPicture.classList.remove(`hidden`);
// document.querySelector(`body`).classList.add(`modal-open`);

const socialComments = bigPicture.querySelector(`.social__comments`);
const socialCommentsCount = bigPicture.querySelector(`.social__comment-count`);
const commentsLoader = bigPicture.querySelector(`.comments-loader`);
socialCommentsCount.classList.add(`hidden`);
commentsLoader.classList.add(`hidden`);


// Удаляю старые комментарии
const oldComments = socialComments.children;
for (let i = oldComments.length - 1; i >= 0; i--) {
  oldComments[i].remove();
}

// Первый элемент из списка постов
const post = posts[FIRST_POST];

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

const renderSocialComments = function () {
  for (let i = 0; i < post.comments.length; i++) {
    createSocialComment(post.comments, i, socialComments);
  }
};

const renderBigPicture = function (item) {
  const image = item.querySelector(`.big-picture__img`).children;
  const likes = item.querySelector(`.likes-count`);
  const commentsCount = item.querySelector(`.comments-count`);
  const description = item.querySelector(`.social__caption`);

  image[0].setAttribute(`src`, post.url);
  description.textContent = post.description;
  likes.textContent = post.likes;
  commentsCount.textContent = post.comments.length;

  renderSocialComments();
};

renderBigPicture(bigPicture);


const uploadFile = document.querySelector(`#upload-file`);
const uploadOverlay = document.querySelector(`.img-upload__overlay`);
const uploadClose = uploadOverlay.querySelector(`#upload-cancel`);
const body = document.querySelector(`body`);
const effectLevelLine = uploadOverlay.querySelector(`.effect-level__line`);
const effectLevelPin = uploadOverlay.querySelector(`.effect-level__pin`);
const effectLevelValue = uploadOverlay.querySelector(`.effect-level__value`);
const uploadForm = document.querySelector(`.img-upload__form`);
const uploadScale = uploadForm.querySelector(`.img-upload__scale`);
const uploadPreview = uploadForm.querySelector(`.img-upload__preview`);
const hashtags = uploadForm.querySelector(`.text__hashtags`);
let uploadScaleValue = uploadForm.querySelector(`.scale__control--value`).value;

uploadScale.addEventListener(`click`, function (evt) {
  if (evt.target.classList.contains(`scale__control--smaller`)) {
    uploadScaleValue = parseInt(uploadScaleValue) - 25;
    if (uploadScaleValue <= 25) {
      uploadScaleValue = 25;
    }
    uploadPreview.style.transform = `scale(${uploadScaleValue / 100})`;
  }

  if (evt.target.classList.contains(`scale__control--bigger`)) {
    uploadScaleValue = parseInt(uploadScaleValue) + 25;
    if (uploadScaleValue > 100) {
      uploadScaleValue = 100;
    }
    uploadPreview.style.transform = `scale(${uploadScaleValue / 100})`;
  }
});

const scale = function (number) {
  number -= 25;
  return number;
};


uploadFile.addEventListener(`change`, function () {
  uploadOverlay.classList.remove(`hidden`);
  body.classList.add(`modal-open`);

  uploadClose.addEventListener(`click`, function () {
    uploadOverlay.classList.add(`hidden`);
    body.classList.remove(`modal-open`);
    uploadFile.value = ``;
  });

  window.addEventListener(`keydown`, function (evt) {
    if (evt.key === `Escape`) {
      uploadOverlay.classList.add(`hidden`);
      body.classList.remove(`modal-open`);
      uploadFile.value = ``;
    }
  });
});

effectLevelPin.addEventListener(`mouseup`, function () {
  effectLevelValue.value = Math.round(effectLevelPin.offsetLeft / effectLevelLine.offsetWidth * 100);

});

uploadForm.addEventListener(`change`, function (evt) {
  if (evt.target.type === `radio`) {
    effectLevelValue.value = 100;
  }
});

hashtags.addEventListener(`input`, function () {
  let arr = hashtags.value.split(` `);
  const reg = /^#[\w]*$/;
  for (let hashtag of arr) {
    if (!reg.test(hashtag)) {
      hashtags.setCustomValidity(`Неверный хештег`);
    }
  }
});
