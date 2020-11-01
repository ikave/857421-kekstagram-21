'use strict';

(function () {
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

  window.util = {
    randomNum: getRandomNum,
    randomValue: getRandomValueArray,
    pressEscKey
  };
})();
