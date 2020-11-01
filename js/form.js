'use strict';

(function () {
  const IMAGE_SCALE_MIN = 25;
  const IMAGE_SCALE_MAX = 100;
  const IMAGE_SCALE_STEP = 25;
  const BASE_EFFECT_LEVEL = 100;


  const uploadFile = document.querySelector(`#upload-file`);
  const uploadOverlay = document.querySelector(`.img-upload__overlay`);
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

  const pressEscapeHandler = function (evt) {
    window.util.pressEscKey(evt, closeUploadPopup);
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
      window.removeEventListener(`keydown`, pressEscapeHandler);
    });

    hashtagInput.addEventListener(`blur`, function () {
      window.addEventListener(`keydown`, pressEscapeHandler);
    });

    textareaInput.addEventListener(`focus`, function () {
      window.removeEventListener(`keydown`, pressEscapeHandler);
    });

    textareaInput.addEventListener(`blur`, function () {
      window.addEventListener(`keydown`, pressEscapeHandler);
    });

    window.addEventListener(`keydown`, pressEscapeHandler);

    window.form = {
      closePopup: closeUploadPopup
    };
  });
})();
