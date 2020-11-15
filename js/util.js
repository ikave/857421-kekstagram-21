'use strict';

const DEBOUNCE_INTERVAL = 500;

const getRandomNum = (min, max) => {
  return Math.round(min + Math.random() * (max - min));
};

const getRandomValue = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const pressEscKey = (evt, action) => {
  if (evt.key === `Escape`) {
    action();
  }
};

const debounce = (cb) => {
  let lastTimeout = null;

  return (...parameters) => {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(() => {
      cb(...parameters);
    }, DEBOUNCE_INTERVAL);
  };
};

window.util = {
  getRandomNum,
  getRandomValue,
  pressEscKey,
  debounce
};
