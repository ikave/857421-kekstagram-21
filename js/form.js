'use strict';

const FILE_TYPES = [`gif`, `jpg`, `jpeg`, `png`];
const IMAGE_SCALE_MIN = 25;
const IMAGE_SCALE_MAX = 100;
const IMAGE_SCALE_STEP = 25;
const BASE_EFFECT_LEVEL = 100;
const EFFECT_POWER = 3;

const body = document.querySelector(`body`);
const main = document.querySelector(`main`);

const uploadFile = document.querySelector(`#upload-file`);
const uploadOverlay = document.querySelector(`.img-upload__overlay`);
const effectLevelBlock = uploadOverlay.querySelector(`.effect-level`);
const effectsPreview = document.querySelectorAll(`.effects__preview`);
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

const getEffects = () => {
  effectLevel = effectLevelInput.value;
  const filterEffects = {
    none: `none`,
    chrome: `grayscale(${effectLevel / 100})`,
    sepia: `sepia(${effectLevel / 100})`,
    marvin: `invert(${effectLevel}%)`,
    phobos: `blur(${effectLevel * EFFECT_POWER / 100}px)`,
    heat: `brightness(${effectLevel * EFFECT_POWER / 100})`,
  };
  return filterEffects;
};

const setEffectLevel = () => {
  let effects = getEffects();
  effectsRadio.forEach((radio) => {
    if (radio.checked) {
      for (let effect in effects) {
        if (radio.value === effect) {
          uploadPreview.style.filter = effects[effect];
        } else if (radio.value === `none`) {
          effectLevelBlock.style.visibility = `hidden`;
        } else {
          effectLevelBlock.style.visibility = `visible`;
        }
      }
    }
  });
};

const submitSuccess = () => {
  closeUploadPopup();
  const successBlock = successUploadTemplate.cloneNode(true);
  main.append(successBlock);
  successBlock.addEventListener(`click`, onMessagePopupClick);
};

const submitError = () => {
  closeUploadPopup();
  const errorBlock = errorUploadTemplate.cloneNode(true);
  main.append(errorBlock);
  errorBlock.addEventListener(`click`, onMessagePopupClick);
};

const showMessagePopup = () => {
  body.classList.add(`modal-open`);
  window.addEventListener(`keydown`, onMessagePressEscape);
  const data = new FormData(uploadForm);
  window.server.upload(data, submitSuccess, submitError);
};

const onMessagePopupClick = (evt) => {
  const target = evt.target;
  if (target[`type`] === `button` || target.tagName.toLowerCase() === `section`) {
    closeMessagePopup();
  }
};

const onMessagePressEscape = (evt) => {
  window.util.pressEscKey(evt, closeMessagePopup);
};

const onFormSubmit = (evt) => {
  evt.preventDefault();
  showMessagePopup();
};

const openUploadPopup = () => {
  uploadOverlay.classList.remove(`hidden`);
  body.classList.add(`modal-open`);
  hashtagInput.value = ``;
  uploadScaleInput.value = `${IMAGE_SCALE_MAX}%`;
  uploadPreview.style.transform = `scale(1)`;
  uploadForm.addEventListener(`submit`, onFormSubmit);
};

const closeMessagePopup = () => {
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
  popup.removeEventListener(`click`, onMessagePopupClick);
  window.removeEventListener(`keydown`, onMessagePressEscape);
};

const onEffectLevelMouseMove = (evt) => {
  evt.preventDefault();

  let startCoords = {
    x: evt.clientX
  };

  const onDocumentMouseMove = (moveEvt) => {
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

  const onDocumentMouseUp = () => {
    document.removeEventListener(`mousemove`, onDocumentMouseMove);
    document.removeEventListener(`mouseup`, onDocumentMouseUp);
  };

  document.addEventListener(`mousemove`, onDocumentMouseMove);
  document.addEventListener(`mouseup`, onDocumentMouseUp);
};

const closeUploadPopup = () => {
  uploadOverlay.classList.add(`hidden`);
  uploadScale.removeEventListener(`click`, onScaleClick);
  uploadFile.value = ``;
  for (let i = 0; i < effectsRadio.length; i++) {
    if (effectsRadio[i].checked) {
      effectsRadio[i].checked = false;
    }
  }
  effectsRadio[0].checked = true;
  effectLevelPin.removeEventListener(`mousedown`, onEffectLevelMouseMove);
  uploadForm.removeEventListener(`submit`, onFormSubmit);
  window.removeEventListener(`keydown`, onEscapePress);
  textareaInput.value = ``;
};

const setScalePicture = (evt, input) => {
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

const onScaleClick = (evt) => {
  setScalePicture(evt, uploadScaleInput);
};

const onEscapePress = (evt) => {
  body.classList.remove(`modal-open`);
  window.util.pressEscKey(evt, closeUploadPopup);
};

const renderPhoto = () => {
  const file = uploadFile.files[0];
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some((it) => {
    return fileName.endsWith(it);
  });

  if (matches) {
    const reader = new FileReader();
    reader.addEventListener(`load`, () => {
      uploadPreview.setAttribute(`src`, reader.result);
      effectsPreview.forEach((preview) => {
        preview.style.backgroundImage = `url(${reader.result})`;
      });
    });
    reader.readAsDataURL(file);
  }
};

uploadFile.addEventListener(`change`, () => {
  renderPhoto();
  openUploadPopup();
  setEffectLevel();

  uploadScale.addEventListener(`click`, onScaleClick);
  window.addEventListener(`keydown`, onEscapePress);

  effectLevel = effectLevelInput.value;

  uploadForm.addEventListener(`change`, (evt) => {
    if (evt.target.type === `radio`) {
      effectLevel = BASE_EFFECT_LEVEL;
      effectLevelInput.setAttribute(`value`, effectLevel);
      effectLevelPin.style.left = `${effectLevelLine.offsetWidth}px`;
      effectLevelDepth.style.width = `${effectLevelLine.offsetWidth}px`;
      setEffectLevel();
    }
  });

  effectLevelPin.addEventListener(`mousedown`, onEffectLevelMouseMove);

  hashtagInput.addEventListener(`focus`, () => {
    window.removeEventListener(`keydown`, onEscapePress);
  });

  hashtagInput.addEventListener(`blur`, () => {
    window.addEventListener(`keydown`, onEscapePress);
  });

  textareaInput.addEventListener(`focus`, () => {
    window.removeEventListener(`keydown`, onEscapePress);
  });

  textareaInput.addEventListener(`blur`, () => {
    window.addEventListener(`keydown`, onEscapePress);
  });

  window.form = {
    close: closeUploadPopup
  };
});
