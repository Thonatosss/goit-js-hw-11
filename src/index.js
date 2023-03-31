'use strict';
import SimpleLightbox from "simplelightbox/dist/simple-lightbox.esm";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { pixabayApiService } from "./pixabay-api";

const pixabayApi = new pixabayApiService();


const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('input'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),

}

refs.form.addEventListener('submit', onSubmitForm);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtn);

function onLoadMoreBtn(event) {
  event.preventDefault();
  pixabayApi.fetchPhotos()
    .then(filterData)
    .catch(error => console.log(error));
}

function onSubmitForm(event) {
  event.preventDefault();
  const {
    elements: { searchQuery }
  } = event.currentTarget;

  pixabayApi.searchQuerry = searchQuery.value;

  pixabayApi.resetPage();

  clearElement(refs.gallery);

  pixabayApi.fetchPhotos().then(response => {
    filterData(response);
    refs.loadMoreBtn.classList.remove('hide-button');
    
  }).catch(error => console.log(error));

}


function filterData(data) {
  const filteredData = data.hits.map(photo => ({
    webformatURL: photo.webformatURL,
    largeImageURL: photo.largeImageURL,
    tags: photo.tags,
    likes: photo.likes,
    views: photo.views,
    comments: photo.comments,
    downloads: photo.downloads,

  }))
  if (data.hits.length === 0) {
    return Notify.failure("Sorry, there are no images matching your search query. Please try again.")
  }
  Notify.success(`Hooray! We found ${data.totalHits} images`)

  fillElementWithContent(refs.gallery, createPhotoMarkup, filteredData);

  document.querySelector(".gallery").firstElementChild.getBoundingClientRect();
  window.scrollBy({
    behavior: "smooth",
  });

  new SimpleLightbox(".photo-card a", {
    scrollZoom: false,
  });

  return filteredData;
}
function clearElement(element) {
  return element.innerHTML = '';
}
function fillElementWithContent(element, markup, data) {
  return element.insertAdjacentHTML('beforeend', markup(data));
}
function createPhotoMarkup(items) {
  return items.reduce((acc, item) => {
    return acc + `
    <div class="photo-card">
    <a href="${item.largeImageURL}" class="photo-link">
    <img src="${item.webformatURL}" alt="" loading="lazy" width='350' height='300' />
    </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${item.likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${item.views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${item.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${item.downloads}
    </p>
  </div>
</div>`;
  }, '');
}


