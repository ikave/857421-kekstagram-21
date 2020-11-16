'use strict';

const UNIQUE_PICTURES_MAX = 10;

const filterBlock = document.querySelector(`.img-filters`);
const filterButtons = filterBlock.querySelectorAll(`.img-filters__button`);

const setActiveFilter = (evt) => {
  filterButtons.forEach((button) => {
    button.classList.remove(`img-filters__button--active`);
    if (evt.target === button) {
      button.classList.add(`img-filters__button--active`);
    }
  });
};

const getUniqueRandomPicture = (data) => {
  const posts = data.slice();
  return posts.sort(() => {
    return window.util.getRandomNum(-1, 1);
  }).slice(0, UNIQUE_PICTURES_MAX);
};

const getMostDiscussPicture = (data) => {
  const posts = data;
  return posts.sort((a, b) => {
    return b.comments.length - a.comments.length;
  });
};

const removePosts = () => {
  const pictures = document.querySelectorAll(`.picture`);
  pictures.forEach((picture) => {
    picture.remove();
  });
};


window.filter = (data) => {
  filterBlock.classList.remove(`img-filters--inactive`);

  let posts = data.slice();

  const filterList = (evt) => {
    setActiveFilter(evt);
    const filter = evt.target.id;
    if (evt.target.id === `filter-default`) {
      removePosts();
      window.gallery.show(data);
    } else if (filter === `filter-random`) {
      removePosts();
      window.gallery.show(getUniqueRandomPicture(posts));
    } else if (filter === `filter-discussed`) {
      removePosts();
      window.gallery.show(getMostDiscussPicture(posts));
    }
  };

  filterBlock.addEventListener(`click`, window.util.debounce(filterList));
};
