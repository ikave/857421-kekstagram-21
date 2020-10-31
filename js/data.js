'use strict';

(function () {
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

  const getMessage = function () {
    let messages = [];

    for (let i = 0; i < window.util.randomNum(MESSAGE_COUNT_MIN, MESSAGE_COUNT_MAX); i++) {
      let message = window.util.randomValue(MESSAGES);
      messages.push(message);
    }

    if (messages[0] === messages[1]) {
      messages[1] = window.util.randomValue(MESSAGES);
    }

    let result = messages.join(` `);

    return result;
  };

  const getMessageAuthor = function (authors) {
    return window.util.randomValue(authors);
  };

  const getPostComments = function () {
    let comments = [];

    for (let i = 0; i < window.util.randomNum(0, POST_COMMENTS_MAX); i++) {
      let comment = {
        avatar: `img/avatar-${window.util.randomNum(1, USER_AVATAR_IMAGE_MAX)}.svg`,
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
      description: window.util.randomValue(POST_DESCRIPTION),
      likes: window.util.randomNum(POST_LIKES_MIN, POST_LIKES_MAX),
      comments: getPostComments()
    };
    return post;
  };

  const getPosts = function () {
    let posts = [];
    for (let i = 1; i <= POST_COUNT; i++) {
      let post = getPost(i);
      post.dataIndex = i;
      posts.push(post);
    }
    return posts;
  };

  window.data = {
    posts: getPosts()
  };
})();
