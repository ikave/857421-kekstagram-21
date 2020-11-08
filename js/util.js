'use strict';

(function () {
  const DEBOUNCE_INTERVAL = 500;

  const getRandomNum = function (min, max) {
    return Math.round(min + Math.random() * (max - min));
  };

  const getRandomValueArray = function (array) {
    return array[Math.floor(Math.random() * array.length)];
  };

  const pressEscKey = function (evt, action) {
    if (evt.key === `Escape`) {
      action();
    }
  };

  const debounce = function (cb) {
    let lastTimeout = null;

    return function (...parameters) {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        cb(...parameters);
      }, DEBOUNCE_INTERVAL);
    };
  };

  window.util = {
    randomNum: getRandomNum,
    randomValue: getRandomValueArray,
    pressEscKey,
    debounce
  };
})();
