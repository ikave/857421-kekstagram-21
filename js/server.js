'use strict';

(function () {
  const URL = `https://21.javascript.pages.academy/kekstagram`;
  const TIMEOUT_IN_MS = 10000;

  const createXhr = function (onSuccess, onError) {

    let xhr = new XMLHttpRequest();
    xhr.responseType = `json`;

    xhr.addEventListener(`load`, function () {
      let error;
      switch (xhr.status) {
        case 200:
          onSuccess(xhr.response);
          break;
        case 400:
          error = `Неверный запрос`;
          break;
        case 401:
          error = `Пользователь не авторизован`;
          break;
        case 404:
          error = `Ничего не найдено`;
          break;

        default:
          error = `Cтатус ответа: ${xhr.status} ${xhr.statusText}`;
      }

      if (error) {
        onError(error);
      }
    });

    xhr.addEventListener(`error`, function () {
      onError(`Произошла ошибка соединения`);
    });

    xhr.addEventListener(`timeout`, function () {
      onError(`Запрос не успел выполниться за ${xhr.timeout}мс`);
    });

    xhr.timeout = TIMEOUT_IN_MS;

    return xhr;
  };

  const load = function (onSuccess, onError) {
    const xhr = createXhr(onSuccess, onError);
    xhr.open(`GET`, `${URL}/data`);
    xhr.send();
  };

  const upload = function (data, onSuccess, onError) {
    const xhr = createXhr(onSuccess, onError);
    xhr.open(`POST`, URL);
    xhr.send(data);
  };

  window.server = {
    load,
    upload
  };
})();
