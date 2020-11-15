'use strict';

const body = document.querySelector(`body`);
let posts = [];

const setDataId = (data) => {
  for (let i = 0; i < data.length; i++) {
    data[i].id = i;
  }
  return data;
};

const onError = (message) => {
  const errorArea = document.createElement(`div`);
  errorArea.textContent = message;
  errorArea.style.position = `absolute`;
  errorArea.style.top = 0;
  errorArea.style.left = 0;
  errorArea.style.padding = `50px`;
  errorArea.style.backgroundColor = `red`;
  body.append(errorArea);
};

const onSuccess = (data) => {
  posts = data.slice();
  setDataId(posts);
  window.gallery.showGallery(posts);
  window.preview.data(posts);
  window.filter(posts);
};

window.server.load(onSuccess, onError);
