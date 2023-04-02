import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox/dist/simple-lightbox.esm";
import InfiniteScroll from "infinite-scroll";

import { pixabayApiService } from "./pixabay-api";

const pixabayApi = new pixabayApiService();

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('input'),
  gallery: document.querySelector('.gallery'),

}
const lightbox = new SimpleLightbox(".photo-card a", {
  scrollZoom: false,
});



refs.form.addEventListener('submit', onSubmitForm);
let infScroll = new InfiniteScroll(refs.gallery, {
  path: function () {
    return `?page=${pixabayApi.page}`;
  },
  append: null,
  history: false,
});

infScroll.on('load', async function () {
  const response = await pixabayApi.fetchPhotos();
  filterData(response);
  if (response.hits.length < 40) {
    infScroll.off('load');

  }
});

async function onSubmitForm(event) {
  event.preventDefault();
  const {
    elements: { searchQuery }
  } = event.currentTarget;

  pixabayApi.searchQuerry = searchQuery.value.trim();
  if(searchQuery.value === ''){
    return Notify.failure('Search querry can not be empty.');
  }
  pixabayApi.resetPage();

  clearElement(refs.gallery);

  try {

    const response = await pixabayApi.fetchPhotos();
    filterData(response);

  } catch (error) {
    Notify.failure(error.message);

  }
  
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

  window.scrollBy({
    behavior: "smooth",
  });

  return filteredData;
  lightbox.refresh();
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