'use strict';

(function () {
  const IMAGE_SCALE_MIN = 25;
  const IMAGE_SCALE_MAX = 100;
  const IMAGE_SCALE_STEP = 25;
  const BASE_EFFECT_LEVEL = 100;

  const body = document.querySelector(`body`);
  const main = document.querySelector(`main`);

  const uploadFile = document.querySelector(`#upload-file`);
  const uploadOverlay = document.querySelector(`.img-upload__overlay`);
  const effectLevelBlock = uploadOverlay.querySelector(`.effect-level`);
  const effectLevelLine = uploadOverlay.querySelector(`.effect-level__line`);
  const effectLevelPin = uploadOverlay.querySelector(`.effect-level__pin`);
  const effectLevelDepth = uploadOverlay.querySelector(`.effect-level__depth`);
  const effectsRadio = uploadOverlay.querySelectorAll(`.effects__radio`);
  const effectLevelInput = uploadOverlay.querySelector(`.effect-level__value`);
  const uploadForm = document.querySelector(`.img-upload__form`);
  const uploadScale = uploadForm.querySelector(`.img-upload__scale`);
  const uploadPreview = uploadForm.querySelector(`.img-upload__preview img`);
  const hashtagInput = uploadForm.querySelector(`.text__hashtags`);
  const textareaInput = uploadForm.querySelector(`.text__description`);
  const uploadScaleInput = uploadForm.querySelector(`.scale__control--value`);

  const successUploadTemplate = document.querySelector(`#success`)
  .content
  .querySelector(`.success`);
  const errorUploadTemplate = document.querySelector(`#error`)
  .content
  .querySelector(`.error`);

  let effectLevel = BASE_EFFECT_LEVEL;


  const getEffects = function () {
    effectLevel = effectLevelInput.value;
    const filterEffects = {
      none: `none`,
      chrome: `grayscale(${effectLevel / 100})`,
      sepia: `sepia(${effectLevel / 100})`,
      marvin: `invert(${effectLevel}%)`,
      phobos: `blur(${effectLevel * 3 / 100}px)`,
      heat: `brightness(${effectLevel * 3 / 100})`,
    };
    return filterEffects;
  };

  const setEffectLevel = function () {
    let effects = getEffects();
    for (let i = 0; i < effectsRadio.length; i++) {
      if (effectsRadio[i].checked) {
        for (let effect in effects) {
          if (effectsRadio[i].value === effect) {
            uploadPreview.style.filter = effects[effect];
          } else if (effectsRadio[i].value === `none`) {
            effectLevelBlock.style.visibility = `hidden`;
          } else {
            effectLevelBlock.style.visibility = `visible`;
          }
        }
      }
    }
  };

  const openUploadPopup = function () {
    uploadOverlay.classList.remove(`hidden`);
    body.classList.add(`modal-open`);
    hashtagInput.value = ``;
    uploadScaleInput.value = `100%`;
    uploadPreview.style.transform = `scale(1)`;
  };

  const mouseMove = function (evt) {
    evt.preventDefault();

    let startCoords = {
      x: evt.clientX
    };

    const mouseMoveHandler = function (moveEvt) {
      let shift = {
        x: startCoords.x - moveEvt.clientX
      };

      startCoords.x = moveEvt.clientX;
      let position = effectLevelPin.offsetLeft - shift.x;
      if (position > effectLevelLine.offsetWidth) {
        position = effectLevelLine.offsetWidth;
        effectLevelDepth.style.width = effectLevelLine.offsetWidth;
      } else if (position <= 0) {
        position = 0;
        effectLevelDepth.style.width = 0;
      } else {
        effectLevelDepth.style.width = `${position}px`;
        effectLevelPin.style.left = `${position}px`;
      }

      effectLevelInput.setAttribute(`value`, Math.round(effectLevelPin.offsetLeft / effectLevelLine.offsetWidth * 100));

      effectLevel = effectLevelInput.value;
      setEffectLevel();
    };

    const mouseUpHandler = function () {

      document.removeEventListener(`mousemove`, mouseMoveHandler);
      document.removeEventListener(`mouseup`, mouseUpHandler);
    };

    document.addEventListener(`mousemove`, mouseMoveHandler);
    document.addEventListener(`mouseup`, mouseUpHandler);
  };

  const closeUploadPopup = function () {
    uploadOverlay.classList.add(`hidden`);
    body.classList.remove(`modal-open`);
    uploadFile.value = ``;
    for (let i = 0; i < effectsRadio.length; i++) {
      if (effectsRadio[i].checked) {
        effectsRadio[i].checked = false;
      }
    }
    effectsRadio[0].checked = true;
    effectLevelPin.removeEventListener(`mousedown`, mouseMove);
    textareaInput.value = ``;
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
    setEffectLevel();

    uploadScale.addEventListener(`click`, function (evt) {
      onScaleClick(evt, uploadScaleInput);
    });

    effectLevel = effectLevelInput.value;

    uploadForm.addEventListener(`change`, function (evt) {
      if (evt.target.type === `radio`) {
        effectLevel = BASE_EFFECT_LEVEL;
        effectLevelInput.setAttribute(`value`, effectLevel);
        effectLevelPin.style.left = `${effectLevelLine.offsetWidth}px`;
        effectLevelDepth.style.width = `${effectLevelLine.offsetWidth}px`;
        setEffectLevel();
      }
    });

    effectLevelPin.addEventListener(`mousedown`, mouseMove);

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

    const pressEscapeMessage = function (evt) {
      window.util.pressEscKey(evt, removeMessagePopup);
    };

    const submitSuccess = function () {
      const successBlock = successUploadTemplate.cloneNode(true);
      closeUploadPopup();
      main.append(successBlock);
      successBlock.addEventListener(`click`, closeMessage);
      window.addEventListener(`keydown`, pressEscapeMessage);
    };

    const submitError = function () {
      const errorBlock = errorUploadTemplate.cloneNode(true);
      closeUploadPopup();
      main.append(errorBlock);
      errorBlock.addEventListener(`click`, closeMessage);
      window.addEventListener(`keydown`, pressEscapeMessage);
    };

    const removeMessagePopup = function () {
      let popup;
      const success = document.querySelector(`.success`);
      const error = document.querySelector(`.error`);
      if (success) {
        popup = success;
      } else {
        popup = error;
      }
      popup.remove();
      body.classList.remove(`modal-open`);
      window.removeEventListener(`keydown`, pressEscapeMessage);
      popup.removeEventListener(`click`, closeMessage);
    };

    const closeMessage = function (evt) {
      const target = evt.target;
      if (target[`type`] === `button` || target.tagName.toLowerCase() === `section`) {
        removeMessagePopup();
      }
    };

    uploadForm.addEventListener(`submit`, function (evt) {
      evt.preventDefault();
      const data = new FormData(uploadForm);
      window.server.upload(data, submitSuccess, submitError);
    });

    window.form = {
      closePopup: closeUploadPopup
    };
  });
})();
