'use strict';

const TIMEOUT_IN_MS = 10000;

const StatusCode = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404
};

const Url = {
  POST: `https://21.javascript.pages.academy/kekstagram`,
  GET: `https://21.javascript.pages.academy/kekstagram/data`
};

const createXhr = (onSuccess, onError) => {

  let xhr = new XMLHttpRequest();
  xhr.responseType = `json`;

  xhr.addEventListener(`load`, () => {
    let error;
    switch (xhr.status) {
      case StatusCode.OK:
        onSuccess(xhr.response);
        break;
      case StatusCode.BAD_REQUEST:
        error = `Неверный запрос`;
        break;
      case StatusCode.UNAUTHORIZED:
        error = `Пользователь не авторизован`;
        break;
      case StatusCode.NOT_FOUND:
        error = `Ничего не найдено`;
        break;

      default:
        error = `Cтатус ответа: ${xhr.status} ${xhr.statusText}`;
    }

    if (error) {
      onError(error);
    }
  });

  xhr.addEventListener(`error`, () => {
    onError(`Произошла ошибка соединения`);
  });

  xhr.addEventListener(`timeout`, () => {
    onError(`Запрос не успел выполниться за ${xhr.timeout}мс`);
  });

  xhr.timeout = TIMEOUT_IN_MS;

  return xhr;
};

const load = (onSuccess, onError) => {
  const xhr = createXhr(onSuccess, onError);
  xhr.open(`GET`, Url.GET);
  xhr.send();
};

const upload = (data, onSuccess, onError) => {
  const xhr = createXhr(onSuccess, onError);
  xhr.open(`POST`, Url.POST);
  xhr.send(data);
};

window.server = {
  load,
  upload
};
