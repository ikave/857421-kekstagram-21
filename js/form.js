'use strict';

(function () {
  const IMAGE_SCALE_MIN = 25;
  const IMAGE_SCALE_MAX = 100;
  const IMAGE_SCALE_STEP = 25;
  const BASE_EFFECT_LEVEL = 100;
  const HASHTAG_WIDTH_MAX = 20;
  const HASHTAGS_MAX_LENGTH = 5;
  const TEXTAREA_MAX_LENGTH = 140;

  const uploadFile = document.querySelector(`#upload-file`);
  const uploadOverlay = document.querySelector(`.img-upload__overlay`);
  const uploadClose = uploadOverlay.querySelector(`#upload-cancel`);
  const body = document.querySelector(`body`);
  const effectLevelLine = uploadOverlay.querySelector(`.effect-level__line`);
  const effectLevelPin = uploadOverlay.querySelector(`.effect-level__pin`);
  const effectLevelInput = uploadOverlay.querySelector(`.effect-level__value`);
  const uploadForm = document.querySelector(`.img-upload__form`);
  const uploadScale = uploadForm.querySelector(`.img-upload__scale`);
  const uploadPreview = uploadForm.querySelector(`.img-upload__preview img`);
  const hashtagInput = uploadForm.querySelector(`.text__hashtags`);
  const textareaInput = uploadForm.querySelector(`.text__description`);
  const uploadScaleInput = uploadForm.querySelector(`.scale__control--value`);

  let effectLevel = BASE_EFFECT_LEVEL;

  const getEffectLevel = function (value) {
    let level = value;
    return level;
  };

  const setEffectLevel = function () {
    effectLevel = Math.round(effectLevelPin.offsetLeft / effectLevelLine.offsetWidth * 100);
    effectLevelInput.value = effectLevel;
  };

  const filterEffects = {
    none: `none`,
    chrome: `grayscale(${getEffectLevel(effectLevel) / 100})`,
    sepia: `sepia(${getEffectLevel(effectLevel) / 100})`,
    marvin: `invert(${getEffectLevel(effectLevel)}%)`,
    phobos: `blur(${getEffectLevel(effectLevel) * 3 / 100}px)`,
    heat: `brightness(${getEffectLevel(effectLevel) * 3 / 100})`,
  };

  const openUploadPopup = function () {
    uploadOverlay.classList.remove(`hidden`);
    body.classList.add(`modal-open`);
    hashtagInput.value = ``;
    uploadScaleInput.value = `100%`;
    uploadPreview.style.transform = `scale(1)`;
  };

  const closeUploadPopup = function () {
    uploadOverlay.classList.add(`hidden`);
    body.classList.remove(`modal-open`);
    uploadFile.value = ``;
  };

  const onScaleClick = function (evt, input) {
    let value = parseInt(input.value, 10);
    if (evt.target.classList.contains(`scale__control--smaller`)) {
      value -= IMAGE_SCALE_STEP;
      input.value = `${value}%`;
      if (value <= IMAGE_SCALE_MIN) {
        value = IMAGE_SCALE_MIN;
        input.value = `${value}%`;
      }
      uploadPreview.style.transform = `scale(${value / 100})`;
    }

    if (evt.target.classList.contains(`scale__control--bigger`)) {
      value += IMAGE_SCALE_STEP;
      input.value = `${value}%`;
      if (value > IMAGE_SCALE_MAX) {
        value = IMAGE_SCALE_MAX;
        input.value = `${value}%`;
      }
      uploadPreview.style.transform = `scale(${value / 100})`;
    }
  };

  const pressEscKey = function (evt) {
    if (evt.key === `Escape`) {
      closeUploadPopup();
    }
  };

  uploadFile.addEventListener(`change`, function () {
    openUploadPopup();

    uploadScale.addEventListener(`click`, function (evt) {
      onScaleClick(evt, uploadScaleInput);
    });

    effectLevelPin.addEventListener(`mouseup`, function () {
      setEffectLevel();
    });

    uploadForm.addEventListener(`change`, function (evt) {
      if (evt.target.type === `radio`) {
        effectLevel = BASE_EFFECT_LEVEL;
        effectLevelInput.value = effectLevel;
        for (let effect in filterEffects) {
          if (evt.target.value === effect) {
            uploadPreview.style.filter = filterEffects[effect];
          }
        }
      }
    });

    hashtagInput.addEventListener(`focus`, function () {
      window.removeEventListener(`keydown`, pressEscKey);
    });

    hashtagInput.addEventListener(`blur`, function () {
      window.addEventListener(`keydown`, pressEscKey);
    });

    textareaInput.addEventListener(`focus`, function () {
      window.removeEventListener(`keydown`, pressEscKey);
    });

    textareaInput.addEventListener(`blur`, function () {
      window.addEventListener(`keydown`, pressEscKey);
    });

    const validity = function (hashtag) {
      const reg = /^#[0-9a-zA-Zа-яА-ЯёЁ]*$/;
      return reg.test(hashtag);
    };

    const getHashtagsArray = function (input) {
      let array = [];
      let hashtags = input.toLowerCase().split(` `);
      for (let hashtag of hashtags) {
        if (hashtag !== ``) {
          array.push(hashtag);
        }
      }
      return array;
    };

    const isDublicateValue = function (array) {
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

    const hashtagsRegValidity = function (hashtags) {
      let result = true;
      for (let hashtag of hashtags) {
        if (validity(hashtag)) {
          result = true;
        } else {
          result = false;
          return result;
        }
      }
      return result;
    };

    const getHashtagLength = function (hashtags) {
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

    const isSharpHashtag = function (hashtags) {
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

    const checkHashtagsValidity = function () {
      let hashtags = getHashtagsArray(hashtagInput.value);

      if (!hashtagsRegValidity(hashtags)) {
        hashtagInput.setCustomValidity(`Неверный хеш-тег`);
      } else if (hashtags.length > HASHTAGS_MAX_LENGTH) {
        hashtagInput.setCustomValidity(`Максимальная количество хеш-тегов не может быть больше ${HASHTAGS_MAX_LENGTH}`);
      } else if (getHashtagLength(hashtags)) {
        hashtagInput.setCustomValidity(`Максимальная длинна хештега ${HASHTAG_WIDTH_MAX} символов`);
      } else if (isSharpHashtag(hashtags)) {
        hashtagInput.setCustomValidity(`Хеш-тег не может состоять только из одной решётки`);
      } else if (isDublicateValue(hashtags)) {
        hashtagInput.setCustomValidity(`Этот хеш-тег уже используется`);
      } else {
        hashtagInput.setCustomValidity(``);
      }
    };

    const checkTextareaLength = function () {
      let invalid = false;
      if (textareaInput.value.length > TEXTAREA_MAX_LENGTH) {
        invalid = true;
      }
      return invalid;
    };

    hashtagInput.addEventListener(`input`, function () {
      checkHashtagsValidity();
    });

    textareaInput.addEventListener(`input`, function () {
      if (checkTextareaLength()) {
        textareaInput.setCustomValidity(`Максимальная длинна сообщения ${TEXTAREA_MAX_LENGTH} символов`);
      } else {
        textareaInput.setCustomValidity(``);
      }
    });

    uploadClose.addEventListener(`click`, function () {
      closeUploadPopup();
    });

    window.addEventListener(`keydown`, pressEscKey);

  });
})();
