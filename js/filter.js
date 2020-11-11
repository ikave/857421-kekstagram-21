'use strict';

(function () {
  const UNIQUE_PICTURES_MAX = 10;

  const filterBlock = document.querySelector(`.img-filters`);
  const filterButtons = filterBlock.querySelectorAll(`.img-filters__button`);

  const setActiveFilter = function (evt) {
    for (let i = 0; i < filterButtons.length; i++) {
      filterButtons[i].classList.remove(`img-filters__button--active`);
      if (evt.target === filterButtons[i]) {
        filterButtons[i].classList.add(`img-filters__button--active`);
      }
    }
  };

  const getUniqueRandomPicture = function (data) {
    const posts = data.slice();
    return posts.sort(function () {
      return window.util.randomNum(-1, 1);
    }).slice(0, UNIQUE_PICTURES_MAX);
  };

  const getMostDiscussPicture = function (data) {
    const posts = data;
    return posts.sort(function (a, b) {
      return b.comments.length - a.comments.length;
    });
  };

  const removePosts = function () {
    const pictures = document.querySelectorAll(`.picture`);
    for (let picture of pictures) {
      picture.remove();
    }
  };


  window.filter = function (data) {
    filterBlock.classList.remove(`img-filters--inactive`);

    let posts = data.slice();

    const filterList = function (evt) {
      setActiveFilter(evt);
      const filter = evt.target.id;
      if (evt.target.id === `filter-default`) {
        removePosts();
        window.render(data);
      } else if (filter === `filter-random`) {
        removePosts();
        window.render(getUniqueRandomPicture(posts));
      } else if (filter === `filter-discussed`) {
        removePosts();
        window.render(getMostDiscussPicture(posts));
      }
    };

    filterBlock.addEventListener(`click`, window.util.debounce(filterList));
  };
})();
