'use strict';

const HASHTAG_WIDTH_MAX = 20;
const HASHTAGS_MAX_LENGTH = 5;
const TEXTAREA_MAX_LENGTH = 140;

const uploadForm = document.querySelector(`.img-upload__form`);
const hashtagInput = uploadForm.querySelector(`.text__hashtags`);
const textareaInput = uploadForm.querySelector(`.text__description`);
const uploadOverlay = document.querySelector(`.img-upload__overlay`);
const uploadClose = uploadOverlay.querySelector(`#upload-cancel`);

const isValidity = (hashtag) => {
  const reg = /^#[0-9a-zA-Zа-яА-ЯёЁ]*$/;
  return reg.test(hashtag);
};

const getHashtagsArray = (input) => {
  let array = [];
  let hashtags = input.toLowerCase().split(` `);
  for (let hashtag of hashtags) {
    if (hashtag !== ``) {
      array.push(hashtag);
    }
  }
  return array;
};

const isDublicateValue = (array) => {
  let result = [];
  let isDublicate = false;
  if (array.length > 1) {
    for (let item of array) {
      if (result.indexOf(item) === -1) {
        result.push(item);
        isDublicate = false;
      } else {
        isDublicate = true;
        return isDublicate;
      }
    }
  }
  return isDublicate;
};

const checkHashtagsRegValidity = (hashtags) => {
  let result = true;
  for (let hashtag of hashtags) {
    if (isValidity(hashtag)) {
      result = true;
    } else {
      result = false;
      return result;
    }
  }
  return result;
};

const checkHashtagLength = (hashtags) => {
  let result = false;
  for (let hashtag of hashtags) {
    if (hashtag.length > HASHTAG_WIDTH_MAX) {
      result = true;
      return result;
    } else {
      result = false;
    }
  }
  return result;
};

const isSharpHashtag = (hashtags) => {
  let result = false;
  for (let hashtag of hashtags) {
    if (hashtag === `#`) {
      result = true;
      return result;
    } else {
      result = false;
    }
  }
  return result;
};

const checkHashtagsValidity = () => {
  let hashtags = getHashtagsArray(hashtagInput.value);

  if (!checkHashtagsRegValidity(hashtags)) {
    hashtagInput.setCustomValidity(`Неверный хеш-тег`);
  } else if (hashtags.length > HASHTAGS_MAX_LENGTH) {
    hashtagInput.setCustomValidity(`Максимальная количество хеш-тегов не может быть больше ${HASHTAGS_MAX_LENGTH}`);
  } else if (checkHashtagLength(hashtags)) {
    hashtagInput.setCustomValidity(`Максимальная длинна хештега ${HASHTAG_WIDTH_MAX} символов`);
  } else if (isSharpHashtag(hashtags)) {
    hashtagInput.setCustomValidity(`Хеш-тег не может состоять только из одной решётки`);
  } else if (isDublicateValue(hashtags)) {
    hashtagInput.setCustomValidity(`Этот хеш-тег уже используется`);
  } else {
    hashtagInput.setCustomValidity(``);
  }
};

const checkTextareaLength = () => {
  let invalid = textareaInput.value.length > TEXTAREA_MAX_LENGTH ? true : false;
  return invalid;
};

hashtagInput.addEventListener(`input`, () => {
  checkHashtagsValidity();
});

textareaInput.addEventListener(`input`, () => {
  if (checkTextareaLength()) {
    textareaInput.setCustomValidity(`Максимальная длинна сообщения ${TEXTAREA_MAX_LENGTH} символов`);
  } else {
    textareaInput.setCustomValidity(``);
  }
});

uploadClose.addEventListener(`click`, () => {
  window.form.closePopup();
});
