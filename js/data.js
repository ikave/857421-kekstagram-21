'use strict';

(function () {
  const body = document.querySelector(`body`);
  let posts = [];

  const setDataId = function (data) {
    for (let i = 0; i < data.length; i++) {
      data[i].id = i;
    }
    return data;
  };

  const onError = function (message) {
    const errorArea = document.createElement(`div`);
    errorArea.textContent = message;
    errorArea.style.position = `absolute`;
    errorArea.style.top = 0;
    errorArea.style.left = 0;
    errorArea.style.padding = `50px`;
    errorArea.style.backgroundColor = `red`;
    body.append(errorArea);
  };

  const onSuccess = function (data) {
    posts = data;
    setDataId(posts);
    window.render(posts);
    window.getData(posts);
  };

  window.load(onSuccess, onError);

})();
